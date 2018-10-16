#!/usr/bin/python

from __future__ import print_function
import random,json
import psycopg2, psycopg2.extras
from flask import Flask, render_template, request, redirect, Response
import binascii
import os
import sys
import urllib2
import hashlib
import uuid

app = Flask(__name__)
#sys.stderr = sys.stdout

def queryDatabase(sql, data, fetchone = False):
    dsn = 'host=%s dbname=%s user=%s password=%s' % (
        'cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com',
        'cs4920',
        'gill',
        'gill'
    )

    ret = []

    with psycopg2.connect(dsn=dsn, cursor_factory=psycopg2.extras.DictCursor) as db:
        with db.cursor() as cursor:
            cursor.execute(sql, data)
            try:
                if fetchone:
                    ret = cursor.fetchone()
                else:
                    ret = cursor.fetchall()
            except:
                ret = None

    return ret
    
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

    data = request.get_json()
    limit = data.get('limit', '')
    offset = data.get('offset', '')
    print(limit,file=sys.stderr)

    sql = '''
        select
            courses.id,
            courses.code,
            courses.name,
            courses.description,
            cast(avg(reviews.rating) as float),
            count(reviews.*),
			courses.study_level
        from courses
        left join reviews on courses.code = reviews.course
        group by courses.id, courses.code, courses.name, courses.description
        order by
            case when avg(reviews.rating) is null then 1 end desc,
            avg(reviews.rating) desc
        limit %s offset %s ;
    '''
    cur.execute(sql, (limit,offset))
   
    records = cur.fetchall()
    return json.dumps(records)


@app.route('/filter', methods=['POST'] )
def filter_course():
    data = request.get_json()
    search_term = data.get('term','')
    offset = data.get('offset','')
    exact = data.get('exact','')
    if(exact):
        offset = '0'
        sql = """SELECT * FROM courses 
            WHERE (LOWER(code) LIKE LOWER(%s))
            limit 10 offset %s; """

    else :
        """ insert a new review """
        sql = """SELECT * FROM courses 
                WHERE (LOWER(code) LIKE LOWER('%%'|| %s || '%%'))
                limit 10 offset %s ; """
    
    conn = None
    vendor_id = None
    try:
        conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")
        cur = conn.cursor()
        cur.execute(sql, (search_term, offset))
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


@app.route('/search', methods=['POST'] )
def search_course():
    #value,search_term    = request.data.split('=',1)
    data = request.get_json()
    print(data,file=sys.stderr)
    search_term = data.get('term','')
    offset = data.get('offset','')
    print(offset,file=sys.stderr)
    """ insert a new review """
    sql = """SELECT * FROM courses 
            WHERE (LOWER(code) LIKE LOWER('%%'|| %s || '%%')) or 
            (LOWER(name) LIKE LOWER('%%' || %s || '%%'))
            limit 10 offset %s ; """
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
        cur.execute(sql, (search_term, search_term, offset))
        # get the generated id back
        records = cur.fetchall()
        # commit the changes to the database
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

@app.route('/submit', methods=['POST'] )
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
             VALUES(%s,%s,%s,%s,%s) 
             RETURNING feedback;"""
    conn = None
    vendor_id = None
    
    get_mean = """SELECT mean_rating,review_count 
                FROM courses 
                WHERE code='%s' """
    set_mean = """UPDATE courses 
            SET mean_rating=%s, review_count=%s 
            WHERE code=%s"""
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
        result = cur.execute(get_mean % course)
        meta = cur.fetchall()
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

@app.route('/signup', methods=['POST'])
def signup():
    users = queryDatabase('select * from users', None)

    try:
        data = request.get_json()
    except:
        return json.dumps({'success': False, 'message': 'Unable to parse json'})

    username = data.get('user')
    password = data.get('pass')
    nickname = data.get('name')

    if username is None:
        return json.dumps({'success': False, 'message': 'Missing username'})

    if not username:
        return json.dumps({'success': False, 'message': 'Username may not be empty'})

    if password is None:
        return json.dumps({'success': False, 'message': 'Missing password'})

    existingUsers = queryDatabase('select * from users where username = %s', (username,))

    if existingUsers:
        return json.dumps({'success': False, 'message': 'User already exists!'})

    salt = binascii.hexlify(os.urandom(32))
    password += salt

    h = hashlib.sha256()
    h.update(password.encode(encoding='utf8'))

    hashedPassword = h.hexdigest()

    sql = 'insert into users (username, nickname, password, salt) values (%s, %s, %s, %s) returning id'
    newUserId = queryDatabase(sql, (username, nickname, hashedPassword, salt), True)

    if newUserId is None:
        return json.dumps({'success': False, 'message': 'Failed to create user'})

    sql = 'select username, nickname from users where id = %s'
    newUser = queryDatabase(sql, (newUserId.get('id'),), True)

    return json.dumps(
        {
            'success': True,
            'data': {
                'username': newUser.get('username'),
                'nickname': newUser.get('nickname')
            }
        }
    )

@app.route('/authenticate', methods=['POST'])
def authenticate():
	data = request.get_json()
	username = data.get('user', '')
	session_token = data.get('session', '')

	conn = None
	exist = None

	try:
		# connect to the PostgreSQL database
		conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
			database = "cs4920", 
			user = "gill", 
			password = "gill")

		cur = conn.cursor()
		cur.execute("SELECT * FROM users WHERE username='%s' AND token='%s'" % (username, session_token))
		exist = cur.fetchall()

		cur.close()
		conn.close()
	except (Exception, psycopg2.DatabaseError) as error:
		print(error,file=sys.stderr)

		if conn is not None:
			conn.close()
		return "Error Error Error !!!"

	if not exist:
		return "" #json.dumps({'success':False}), 200, {'ContentType':'application/json'} 
	else:
            return json.dumps(exist)

@app.route('/logout', methods=['POST'])
def logout():
	data = request.get_json()
	username = data.get('user', '')
	session_token = data.get('session', '')

	conn = None
	exist = None

	try:
		# connect to the PostgreSQL database
		conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
			database = "cs4920", 
			user = "gill", 
			password = "gill")

		cur = conn.cursor()
		cur.execute("SELECT * FROM users WHERE username='%s' AND token='%s'" % (username, session_token))
		exist = cur.fetchall()
		if exist:
			cur.execute("UPDATE users SET token='%s' WHERE username='%s';" % ('', username))
			conn.commit()
			

		cur.close()
		conn.close()
	except (Exception, psycopg2.DatabaseError) as error:
		print(error,file=sys.stderr)

		if conn is not None:
			conn.close()
		return "Error Error Error !!!"

	if not exist:
		return json.dumps({'success':False}), 200, {'ContentType':'application/json'} 
	else:
		return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

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
      cur.execute('SELECT password, salt,id FROM users WHERE username = %s;', (username,))
      exist = cur.fetchall()



      # if [] is returned, it means the user does not exist
      if not exist:
         return "Sorry, The username \'{}\' is NOT existed !!".format(username)

      # Get the salt from the fetched results, then
      # compare stored hash with that of the input password (plus salt)
      pwd_hash, salt,uid = exist[0] 
      password += salt            

      h = hashlib.sha256()
      h.update(password.encode(encoding='utf8'))
      
      if pwd_hash == h.hexdigest():
         session_tok = uuid.uuid1()

         sql = "UPDATE users SET token='%s' WHERE username='%s';" % (str(session_tok), username)

         cur.execute(sql)
         conn.commit()

         # close the connection to the postgresql database
         cur.close()
         conn.close()

         return json.dumps({'success':True, "token":str(session_tok),"uid":uid }), 200, {'ContentType':'application/json'} 

      # close the connection to the postgresql database
      cur.close()
      conn.close()
      return json.dumps({'success':False}), 200, {'ContentType':'application/json'} 

   except (Exception, psycopg2.DatabaseError) as error:
      print(error,file=sys.stderr)

      if conn is not None:
         conn.close()

      return "Error Error Error !!!"


########### Functions for adding completed courses ###########
@app.route('/addcompleted', methods=['POST'] )
def add_completed_course():
    data = request.get_json()
    course = data.get('course','')
    user = data.get('user','')
    operation = data.get('type')
    print(course,file=sys.stderr)
    """ insert a new review """
    sql = """insert into completed_courses(uid,ccode) 
                values(%s,UPPER(%s));"""
    
    if(operation == 'DEL'):
        sql=""" DELETE FROM completed_courses where uid=%s and ccode=UPPER(%s);"""

    conn = None
    vendor_id = None
    
    try:
        # read database configuration
        # connect to the PostgreSQL database
        conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")
        cur = conn.cursor()
        cur.execute(sql,(user,course))
        conn.commit() 
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error,file=sys.stderr)
    finally:
        if conn is not None:
            conn.close()
    return  json.dumps({'success':True}), 200, {'ContentType':'application/json'}


@app.route('/completedcourses', methods=['POST'] )
def completed_courses():
    data = request.get_json()
    course = data.get('term','')
    user = data.get('user','')
    sql = """SELECT * FROM courses 
            WHERE (code LIKE UPPER('%s')) ; """


    checkcomplete ="""select exists(select 1 from completed_courses where 
                    uid=%s and ccode=UPPER(%s)) ;"""
    
    conn = None
    vendor_id = None
    try:
        conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")
        cur = conn.cursor()
        cur.execute(sql % course) 
        records = cur.fetchall()
        if (cur.rowcount != 0):
            cur.execute(checkcomplete,(user,course))
            records.append(cur.fetchall())

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

#############Functions for Account page#########

@app.route('/allreviewed', methods=['POST'] )
def get_all_reviewed():
    data = request.get_json()
    user = data.get('user','')
    sql = """SELECT * FROM reviews 
            WHERE uid=%s ; """

    
    conn = None
    vendor_id = None
    try:
        conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")
        cur = conn.cursor()
        cur.execute(sql % user) 
        records = cur.fetchall()
        cur.close()
        if conn is not None: 
            conn.close()
        return json.dumps(records)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error,file=sys.stderr)
        if conn is not None:
            conn.close()
    return ""

@app.route('/allcompleted', methods=['POST'] )
def get_all_completed():
    data = request.get_json()
    user = data.get('user','')
    sql = """SELECT ccode FROM completed_courses 
            WHERE uid=%s ; """

    
    conn = None
    vendor_id = None
    try:
        conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")
        cur = conn.cursor()
        cur.execute(sql % user) 
        records = cur.fetchall()
        
        cur.close()
        if conn is not None: 
            conn.close()
        return json.dumps(records)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error,file=sys.stderr)
        if conn is not None:
            conn.close()
    return ""
@app.route('/userinfo', methods=['POST'])
def get_user_information():
    data = request.get_json()
    user = data.get('user')

    sql ="""select username, nickname from users where id=%s ;"""
    
    conn = None
    vendor_id = None
    try:
        conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")
        cur = conn.cursor()
        cur.execute(sql % user) 
        records = cur.fetchall()

        conn.commit()
        cur.close()

    except psycopg2.Error as e:
        print(e, file=sys.stderr)

    finally:
        if cur is not None:
            cur.close()

    return json.dumps({'success':True, "name":records[0][1],"username":records[0][0] }), 200, {'ContentType':'application/json'} 

############
@app.route('/adminPage', methods=['POST'])
def adminPage():

   # Returns only "inappropriate" or "flagged" reviews
   sql = 'SELECT id, course, author, feedback FROM reviews WHERE flagged = TRUE ORDER BY id ;'
   data = None

   reviews = queryDatabase(sql, data)
   return json.dumps(reviews)


@app.route('/flagPost', methods=['POST'])
def flagPost():
   data = request.get_json()
   post_id = data.get('post', '')

   if post_id == '':
      return json.dumps({'success': 'Updated ? = 0'}), 200, {'ContentType':'application/json'} 
   else:
      _, post_id = post_id.split('_', 1)     

   conn = None
   cur = None
   updated = '0'

   try:
      # connect to the PostgreSQL database
      conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                              database = "cs4920", 
                              user = "gill", 
                              password = "gill")

      # create a new cursor and flag the post with id == post_id
      cur = conn.cursor()
      cur.execute('UPDATE reviews SET flagged = TRUE WHERE id = %s;', (post_id,))

      # updated - whether or not the post is updated/flagged (0:NO , 1:YES)
      conn.commit()
      updated = cur.statusmessage[-1]

   except psycopg2.Error as e:
      print(e, file=sys.stderr)

   finally:
      if cur is not None:
         cur.close()

      if conn is not None:
         conn.close()

   return json.dumps({'success': "Updated ? = " + updated}), 200, {'ContentType':'application/json'} 

   
@app.route('/deletePost', methods=['POST'])
def deletePost():

   # get the post_id from the json object parsed
   data = request.get_json()
   post_id = data.get('post', '')

   if post_id == '':
      return json.dumps({'success': "Deleted ? = 0"}), 200, {'ContentType':'application/json'} 
  
   conn = None
   cur = None
   deleted = '0'

   try:
      # connect to the PostgreSQL database
      conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                              database = "cs4920", 
                              user = "gill", 
                              password = "gill")

      # create a new cursor and Delete the post with id == post_id
      cur = conn.cursor()
      cur.execute('DELETE FROM reviews WHERE id = %s;', (post_id,))

      # deleted - whether or not the post is deleted (0:NO , 1:YES)
      conn.commit()
      deleted = cur.statusmessage[-1]

   except psycopg2.Error as e:
      print(e, file=sys.stderr)

   finally:
      if cur is not None:
         cur.close()

      if conn is not None:
         conn.close()

   return json.dumps({'success': "Deleted ? = " + deleted}), 200, {'ContentType':'application/json'} 



if __name__ == '__main__':
   app.run()
