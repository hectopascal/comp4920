import scrapy
import json
import psycopg2
import re

# class scrapy.http.Request(url[, callback, method='GET', headers, body, cookies, meta, encoding='utf-8', priority=0, dont_filter=False, errback, flags]):
#

class CourseSpider(scrapy.Spider):
    name = "courses"
    # start_urls = [
    #     'https://www.handbook.unsw.edu.au/undergraduate/courses/2019/ACCT1501/?q=&ct=all'
    # ]
    def start_requests(self):
        form_data = { "track_scores":True,"_source":{"includes":["*.code","*.name","*.award_titles","*.keywords","*.active","urlmap","contenttype"],"excludes":["",None,None]},"query":{"filtered":{"query":{"bool":{"must":[{"bool":{"minimum_should_match":"100%","should":[{"query_string":{"fields":["*owning_org*"],"query":"*1a3a1d4f4f4d97404aa6eb4f0310c780*"}}]}},{"query_string":{"fields":["*.active"],"query":"*1*"}}]}},"filter":{"bool":{"should":[{"term":{"contenttype":"subject"}}],"must_not":[{"missing":{"field":"*.name"}}]}}}},"from":0,"size":10,"sort":[{"subject.code":"asc"}] }
        request_body = json.dumps(form_data)
        yield scrapy.Request('https://www.handbook.unsw.edu.au/api/es/search',
                                callback=self.parse,
                                method='POST',
                                body=request_body,
                                headers={'Content-type': 'application/json; charset=UTF-8'}, )

    def parse(self, response):
        # this function scrapes the curr page #returns response.body
        # page = response.url.split("/")[-2]
        # filename = 'courses-%s.html' % page
        # with open(filename, 'wb') as f:
        #     f.write(response.body)
        index=0
        data = json.loads(response.body)
        sql_command = """INSERT INTO courses (code, name, description) VALUES (%s, %s, %s)"""

        connection = psycopg2.connect(database="cs4920",user="linda", password="linda", host="cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com")
        curr = connection.cursor()

        # print(data["contentlets"])

        my_data = []
        for item in data["contentlets"]:
            code = item['code']
            # code = int(code)
            name = item['name']
            description = item['description']
            description = re.sub(r'</*p>', "", description)
            description = re.sub(r'\n*', "", description)

            my_data.append([code, name, description])

            # sql_command = """SELECT * FROM courses"""
            # curr.executemany(sql_command, (my_data))
            curr.execute(sql_command,(my_data[index][0],my_data[index][1],my_data[index][2]))
            connection.commit()
            index+=1


        # my_data = []
        # code = 'COMP2121'
        # name = 'Microprocessors and Interfacing'
        # description = 'Instruction Set Architecture (ISA), Floating point number representation, computer arithmetic, assembly and machine language programming, machine language fundamentals;'
        # my_data.append([code, name, description])
        # sql_command = "INSERT INTO courses (code, name, description) VALUES (%s, %s, %s)"
        # curr.execute(sql_command, (my_data[0][0],my_data[0][1],my_data[0][2]))


        curr.close()
        connection.close()
        # yield {
        #     # response.css('div.column').extract_first(),
        #     # data = json.loads(response.body)
        #     # print(data["contentlets"])
        #     data["contentlets"]
        # }
            #     'text': quote.css('span.text::text').extract_first(),
            #     'author': quote.css('small.author::text').extract_first(),
            #     'tags': quote.css('div.tags a.tag::text').extract(),
            # }
