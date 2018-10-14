import scrapy
import psycopg2
import re
from scrapy.selector import Selector
from scrapy.http import HtmlResponse


class CourseSpider(scrapy.Spider):
    name = "prereq"

# For all courses found in database 'courses'
# Grab html for course
# Grab prereq for courses
# Clean data for prereqs


    def start_requests(self):
        conn = None
        course_ids=()
        try:
            sql_command = """SELECT code FROM courses"""
            conn = psycopg2.connect(database="cs4920",user="linda", password="linda", host="cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com")
            cur = conn.cursor()
            cur.execute(sql_command)
            # print("The number of parts: ", cur.rowcount)
            course_ids = cur.fetchall()

            # while row is not None:
            #     print(row)
            #     row = cur.fetchall()
            # for course in course_ids:
            #     print(course)

            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn is not None:
                conn.close()

        index = 0
        # for course in course_ids:
        # final_list=[]
        while (index < len(course_ids)):
            # print(course_ids[index])
            # string= "https://www.handbook.unsw.edu.au/undergraduate/courses/2019/".join(course_ids[index])  + "/"
            course= "".join(course_ids[index])
            # final_list.append(string)
            yield scrapy.Request( "https://www.handbook.unsw.edu.au/undergraduate/courses/2019/%s" % course )
            index+=1

        # yield scrapy.Request(final_list)

    def parse(self, response):
        # data = json.loads(response.body)
        self.logger.info('Hi, this is an item page! %s', response.url)
        code = response.xpath('//strong[@class="code"]/text()').extract_first()
        print(code)

        # Scrape prereq data as string
        prereq = response.xpath('//div[@id="SubjectConditions"]')
        div_selectors_prereq = prereq.xpath(".//div")
        for div in div_selectors_prereq:
            prereq_text = div.xpath("text()").extract_first()
            if ("Prerequisite:") in prereq_text:
                print(prereq_text)

        # Scrape equivalence data as 1 course per line
        # Save as string
        equal_i=0
        equal_string = ""
        equal = response.xpath('//div[@id="equivalence-rules"]')
        span_selectors_equal = equal.xpath('.//span[re:test(@class, "align-left")]')
        for span_equal in span_selectors_equal:
            equal_courses = span_equal.xpath("text()").extract()
            # while (equal_i < len(equal_courses)):
            for course_text_equal in equal_courses:
                # print(equal_courses[equal_i])
                equal_string = equal_string + course_text_equal
                equal_i+=1
                if (equal_i != len(span_selectors_equal)):
                    equal_string = equal_string + ", "
        print ("this is final equal string: " + equal_string)

        # scrape exclusion data as 1 course per line
        # Save as string
        excln_i = 0;
        excln_string = ""
        excln = response.xpath('//div[@id="exclusion-rules"]')
        span_selectors_excln = excln.xpath('.//span[re:test(@class, "align-left")]')
        for span_excln in span_selectors_excln:
            excln_courses = span_excln.xpath("text()").extract()
            for course_text_excln in excln_courses:
                # print(course_text_excln)
            # while (excln_i < len(excln_courses)):
                # print ("excln length is: %d" % len(excln_courses))
                # print(excln_courses[excln_i])
                excln_string = excln_string + course_text_excln
                excln_i+=1
                if (excln_i < len(span_selectors_excln)):
                    excln_string = excln_string + ", "
                # print("***" + excln_string + "***")
        print ("this is final exclusion string: " + excln_string)
