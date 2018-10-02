import scrapy
import json
import psycopg2
import re
from lxml import html
from lxml.html.clean import clean_html

class CourseSpider(scrapy.Spider):
    name = "courses"

    def start_requests(self):
        form_data = { "track_scores":True,"_source":{"includes":["*.code","*.name","*.award_titles","*.keywords","*.active","urlmap","contenttype"],"excludes":["",None,None]},"query":{"filtered":{"query":{"bool":{"must":[{"bool":{"minimum_should_match":"100%","should":[{"query_string":{"fields":["*owning_org*"],"query":"*1a3a1d4f4f4d97404aa6eb4f0310c780*"}}]}},{"query_string":{"fields":["*.active"],"query":"*1*"}}]}},"filter":{"bool":{"should":[{"term":{"contenttype":"subject"}}],"must_not":[{"missing":{"field":"*.name"}}]}}}},"from":0,"size":120,"sort":[{"subject.code":"asc"}] }
        request_body = json.dumps(form_data)
        yield scrapy.Request('https://www.handbook.unsw.edu.au/api/es/search',
                                callback=self.parse,
                                method='POST',
                                body=request_body,
                                headers={'Content-type': 'application/json; charset=UTF-8'}, )

    def parse(self, response):
        index=0
        data = json.loads(response.body)
        sql_command = """INSERT INTO courses (code, name, description) VALUES (%s, %s, %s)"""

        connection = psycopg2.connect(database="cs4920",user="linda", password="linda", host="cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com")
        curr = connection.cursor()

        my_data = []
        for item in data["contentlets"]:
            if 'code' not in item:
                continue
            else:
                code = item['code']
            if 'name' not in item:
                continue
            else:
                name = item['name']
            if 'description' not in item:
                continue
            else:
                description = item["description"]

                description.strip();
                description = clean_html(description)

            my_data.append([code, name, description])

            try:
                curr.execute(sql_command,(my_data[index][0],my_data[index][1],my_data[index][2]))
            except psycopg2.Error:
                connection.rollback()
            else:
                connection.commit()
            index+=1

        curr.close()
        connection.close()
