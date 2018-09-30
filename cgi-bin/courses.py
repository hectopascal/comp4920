#!/usr/bin/python

from __future__ import print_function
import random,json
import psycopg2
from flask import Flask, render_template, request, redirect, Response
import sys
import urllib2
app = Flask(__name__)
#sys.stderr = sys.stdout

@app.route('/get_reviews', methods=['GET', 'POST'])
def get_reviews():
	sql = """SELECT * FROM reviews"""
	conn = None
	vendor_id = None
	try:
		conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "gill", 
                           password = "gill")

		cur = conn.cursor()
		cur.execute(sql)

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

@app.route('/courses')
def json_courses():
   conn = psycopg2.connect(host = "cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com", 
                           database = "cs4920", 
                           user = "kelvin", 
                           password = "kelvin")
   
   cur = conn.cursor()
   cur.execute("SELECT * FROM courses;")
   
   records = cur.fetchall()
   return json.dumps(records)

@app.route('/search', methods=['GET','POST'] )
def search_course():
    print(request.form,file=sys.stderr)
    print(request.values,file=sys.stderr)
    print(request.args,file=sys.stderr)
    #search_term = 'network'
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
    
    value,course    = name.split('=',1)
    offering        = 5 #temporary value until all the offering/course information is in the database
    print(course,file=sys.stderr)
    value,name      = name.split('=',1)
    user            = urllib2.unquote(name)

    value,rating    = rating.split('=',1)
    
    value,review    = review.split('=',1)
    review          = urllib2.unquote(review)
    
    """ insert a new review """
    sql = """INSERT INTO reviews(offering,rating,feedback,author)
             VALUES(%s,%s,%s,%s) RETURNING feedback;"""
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
        cur.execute(sql, (offering,rating,review,user))
        # get the generated id back
        vendor_id = cur.fetchone()[0]
        # commit the changes to the database
        conn.commit()
        #cur.execute("SELECT * from reviews")
        #records = cur.fetchall()
        # close communication with the database
        cur.close()
        #if conn is not None:
        #    conn.close()
        #return json.dumps(records)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error,file=sys.stderr)
    finally:
        if conn is not None:
            conn.close()
    return  json.dumps({'success':True}), 200, {'ContentType':'application/json'}

if __name__ == '__main__':
   app.run()
