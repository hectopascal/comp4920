#!/usr/bin/python3

import json
import psycopg2

from flask import Flask
app = Flask(__name__)

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

if __name__ == '__main__':
   app.run()
