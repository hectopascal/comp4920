#!/usr/bin/python

from __future__ import print_function
import random,json
import psycopg2
from flask import Flask, render_template, request, redirect, Response
import sys
import urllib2
import hashlib

app = Flask(__name__)
#sys.stderr = sys.stdout


@app.route('/rate_review', methods=['POST'])
def rate_review():

    data = request.get_json()

    # get the data from fields in the POST form
    # rate up change = 0 rate down change = 1
    change = data.get('type', '')
    value,postid = data.get('post', '').split('_',1);

    conn = None  
    get_score = """SELECT score FROM reviews WHERE id=%s"""
    set_score = """UPDATE reviews SET score=%s WHERE id=%s"""
    conn = None
    vendor_id = None
    try:
        conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")

        cur = conn.cursor()
        cur.execute(get_score % postid)
        score = cur.fetchall()[0][0]
        #update score
        if(change == 1):
            score = score - 1
        elif(change == 0):
            score = score + 1
        cur.execute(set_score,(score,postid))
        #commit & close
        conn.commit()
        cur.close()
        
        if conn is not None:
            conn.close()
        return json.dumps(score)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error,file=sys.stderr)
        if conn is not None:
                conn.close()
    
    return "Error Error Error !!!"


@app.route('/meanrating', methods=['GET', 'POST'])
def get_mean_rating():
	sql = """SELECT mean_rating FROM courses WHERE code='%s'"""
	conn = None
	vendor_id = None
	try:
            conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                       database = "cs4920", 
                       user = "gill", 
                       password = "gill")

            cur = conn.cursor()
            cur.execute(sql % request.data)

            records = cur.fetchall()
            cur.close()
            if conn is not None:
                    conn.close()
            return json.dumps(records);

	except (Exception, psycopg2.DatabaseError) as error:
		print(error,file=sys.stderr)
		if conn is not None:
			conn.close()
	return ""


@app.route('/get_reviews', methods=['GET', 'POST'])
def get_reviews():
	sql = """SELECT * FROM reviews WHERE course='%s'"""
	conn = None
	vendor_id = None
	try:
		conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")

		cur = conn.cursor()
		cur.execute(sql % request.data)

		records = cur.fetchall()

		conn.commit()

		cur.close()
		if conn is not None:
			conn.close()
		return json.dumps(records)

	except (Exception, psycopg2.DatabaseError) as error:
		print(error,file=sys.stderr)
		if conn is not None:
			conn.close()
	return ""

@app.route('/courses', methods=['POST'])
def json_courses():
   conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "kelvin", 
                           password = "kelvin")
   
   cur = conn.cursor()

   sql = '''
        select
            courses.id,
            courses.code,
            courses.name,
            courses.description,
            cast(avg(reviews.rating) as float),
            count(reviews.*)
        from courses
        left join reviews on courses.code = reviews.course
        group by courses.id, courses.code, courses.name, courses.description
        order by
            case when avg(reviews.rating) is null then 1 end desc,
            avg(reviews.rating) desc
        limit 10
   '''
   cur.execute(sql, None)
   
   records = cur.fetchall()
   return json.dumps(records)

@app.route('/filter', methods=['POST'] )
def filter_course():
    value,search_term    = request.data.split('=',1)
    """ insert a new review """
    sql = """SELECT * FROM courses WHERE (LOWER(code) LIKE LOWER('%%'|| '%s' || '%%')) limit 10; """
    conn = None
    vendor_id = None
    try:
        conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")
        cur = conn.cursor()
        cur.execute(sql % search_term)
        records = cur.fetchall()
        conn.commit()
        cur.close()
        if conn is not None: 
            conn.close()
        return json.dumps(records)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error,file=sys.stderr)
        if conn is not None:
            conn.close()
    return ""


@app.route('/search', methods=['GET','POST'] )
def search_course():
    #print(request.form,file=sys.stderr)
    #print(request.values,file=sys.stderr)
    #print(request.args,file=sys.stderr)
    value,search_term    = request.data.split('=',1)
    """ insert a new review """
    sql = """SELECT * FROM courses WHERE (LOWER(code) LIKE LOWER('%%'|| %s || '%%'))
            or (LOWER(name) LIKE LOWER('%%' || %s || '%%'));"""
    conn = None
    vendor_id = None
    try:
        # read database configuration
        # connect to the PostgreSQL database
        conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")
        # create a new cursor
        cur = conn.cursor()
        # execute the INSERT statement
        cur.execute(sql, (search_term, search_term))
        # get the generated id back
        records = cur.fetchall()
        # commit the changes to the database
        conn.commit()
        #cur.execute("SELECT * from reviews")
        #records = cur.fetchall()
        # close communication with the database
        cur.close()
        if conn is not None: 
            conn.close()
        return json.dumps(records)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error,file=sys.stderr)
        if conn is not None:
            conn.close()
    return ""

@app.route('/submit', methods=['GET','POST'] )
def submit_form():
    print(request.data,file=sys.stderr)
    course, name, rating, review = request.data.split("&",3)
    
    value,course    = course.split('=',1)
    offering        = 5 #temporary value until all the offering/course information is in the database
    score           = 0
    print(course,file=sys.stderr)
    value,name      = name.split('=',1)
    user            = urllib2.unquote(name)

    value,rating    = rating.split('=',1)
    
    value,review    = review.split('=',1)
    review          = urllib2.unquote(review)
    
    """ insert a new review """
    sql = """INSERT INTO reviews(rating,feedback,author,score,course)
             VALUES(%s,%s,%s,%s,%s) RETURNING feedback;"""
    conn = None
    vendor_id = None
    
    get_mean = """SELECT mean_rating,review_count FROM courses WHERE code='%s' """
    set_mean = """UPDATE courses SET mean_rating=%s, review_count=%s WHERE code=%s"""
    try:
        # read database configuration
        # connect to the PostgreSQL database
        conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")
        cur = conn.cursor()
        cur.execute(sql, (rating,review,user,score,course))
        vendor_id = cur.fetchone()[0]


        conn.commit()
        #update average rating
        print("before executed get mean",file=sys.stderr)
        result = cur.execute(get_mean % course)
        print("executed get mean",file=sys.stderr)
        meta = cur.fetchall()
        print(meta[0],file=sys.stderr)
        mean = float(meta[0][0])
        count = int(meta[0][1])
        count = count+1
        mean = (float(count-1)*mean + float(rating))/float(count)
        cur.execute(set_mean,(mean,int(count),course))
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error,file=sys.stderr)
    finally:
        if conn is not None:
            conn.close()
    return  json.dumps({'success':True}), 200, {'ContentType':'application/json'}


@app.route('/login', methods=['POST'])
def login_verify():

   data = request.get_json()

   # get the data from fields in the POST form
   username = data.get('user', '')
   password = data.get('pass', '')

   # TODO: Delete this later - just for testing
   #username = 'apple'
   #password = '123'

   # convert username to lowercase
   username = username.lower()

   # check if either username or password is empty
   if username == '' or password == '':
      return json.dumps({'success':False}), 200, {'ContentType':'application/json'} 

   
   conn = None  

   try:
      # connect to the PostgreSQL database
      conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                              database = "cs4920", 
                              user = "gill", 
                              password = "gill")

      # create a new cursor
      cur = conn.cursor()
      
      # check if the username is used before 
      cur.execute('SELECT password, salt FROM users WHERE username = %s;', (username,))
      exist = cur.fetchall()

      # close the connection to the postgresql database
      cur.close()
      conn.close()

      # if [] is returned, it means the user does not exist
      if not exist:
         return "Sorry, The username \'{}\' is NOT existed !!".format(username)

      # Get the salt from the fetched results, then
      # compare stored hash with that of the input password (plus salt)
      pwd_hash, salt = exist[0] 
      password += salt            

      h = hashlib.sha256()
      h.update(password.encode(encoding='utf8'))
      
      if pwd_hash == h.digest().hex():
         return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

      return json.dumps({'success':False}), 200, {'ContentType':'application/json'} 

   except (Exception, psycopg2.DatabaseError) as error:
      print(error,file=sys.stderr)

      if conn is not None:
         conn.close()

      return "Error Error Error !!!"

if __name__ == '__main__':
   app.run()
