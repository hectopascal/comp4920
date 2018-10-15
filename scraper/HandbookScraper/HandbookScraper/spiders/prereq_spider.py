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
            course_ids = cur.fetchall()

            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn is not None:
                conn.close()

        index = 0
        while (index < len(course_ids)):
            course= "".join(course_ids[index])
            start_urls = [
                "https://www.handbook.unsw.edu.au/undergraduate/courses/2019/%s" % course,
                "https://www.handbook.unsw.edu.au/postgraduate/courses/2019/%s" % course
            ]
            for u in start_urls:
                yield scrapy.Request(u)
            index+=1

    def parse(self, response):
        # data = json.loads(response.body)
        self.logger.info('Hi, this is an item page! %s', response.url)
        code = response.xpath('//strong[@class="code"]/text()').extract_first()
        print(code)

        # Scrape prereq data as string
        prereq = response.xpath('//div[@id="SubjectConditions"]')
        prereq_courses = ""
        div_selectors_prereq = prereq.xpath(".//div")
        for div in div_selectors_prereq:
            prereq_text = div.xpath("text()").extract_first()
            if ("Prerequisite:") in prereq_text:
                # print(prereq_text)
                temp = prereq_text.split(": ")
                prereq_courses = temp[1]
                print("this is prereqs: "+prereq_courses)

        # Scrape equivalence data as 1 course per line
        # Save as string
        equal_i=0
        equal_string = ""
        equal = response.xpath('//div[@id="equivalence-rules"]')
        span_selectors_equal = equal.xpath('.//span[re:test(@class, "align-left")]')
        for span_equal in span_selectors_equal:
            equal_courses = span_equal.xpath("text()").extract()
            for course_text_equal in equal_courses:
                equal_string = equal_string + course_text_equal
                equal_i+=1
                if (equal_i != len(span_selectors_equal)):
                    equal_string = equal_string + ", "


        # scrape exclusion data as 1 course per line
        # Save as string
        excln_i = 0;
        excln_string = ""
        excln = response.xpath('//div[@id="exclusion-rules"]')
        span_selectors_excln = excln.xpath('.//span[re:test(@class, "align-left")]')
        for span_excln in span_selectors_excln:
            excln_courses = span_excln.xpath("text()").extract()
            for course_text_excln in excln_courses:
                excln_string = excln_string + course_text_excln
                excln_i+=1
                if (excln_i < len(span_selectors_excln)):
                    excln_string = excln_string + ", "

        # study_level =  response.xpath('//*[@id="default-page-details-template"]/div[3]/div[2]/div/div/div/div[3]/div[1]/div/div/div[3]/div/p')
        study_level_undergrad = response.xpath('//p[@class="enable-helptext"]/text()').extract_first()
        study_leve_postgrad = response.xpath('//button[@class="helptext__help--label"]/text()').extract_first()
        # print(study_level_undergrad)
        # print(study_leve_postgrad)
        study_level = "";
        if (study_level_undergrad):
            study_level = study_level_undergrad
        elif (study_leve_postgrad):
            study_level = study_leve_postgrad
        print(study_level)

        # Send Prerequisite, equivalence and exclusions to Database
        # prereq_courses
        # equal_string
        # excln_string

        try:
            sql_command_prereq = """UPDATE courses SET prereqs = %s WHERE code = %s;"""
            sql_command_equal = """UPDATE courses SET exclusions = %s WHERE code = %s;"""
            sql_command_excln = """UPDATE courses SET equivalence = %s WHERE code = %s;"""
            sql_command_lvl = """UPDATE courses SET study_level = %s WHERE code = %s;"""
            conn = psycopg2.connect(database="cs4920",user="linda", password="linda", host="cs4920.ckc9ybbol3wz.ap-southeast-2.rds.amazonaws.com")
            cur = conn.cursor()

            if prereq_courses:
                try:
                    cur.execute(sql_command_prereq,(prereq_courses, code))
                    print("prereq executed: %d" % cur.rowcount)

                except psycopg2.Error:
                    conn.rollback()
                else:
                    conn.commit()

            if excln_string:
                try:
                    cur.execute(sql_command_excln,(excln_string, code))
                    print("exclusion executed: %d" % cur.rowcount)
                except psycopg2.Error:
                    conn.rollback()
                else:
                    conn.commit()

            if equal_string:
                try:
                    cur.execute(sql_command_equal,(equal_string, code))
                    print("equivalence executed: %d" % cur.rowcount)
                except psycopg2.Error:
                    conn.rollback()
                else:
                    conn.commit()
            if (study_level):
                try:
                    cur.execute(sql_command_lvl,(study_level, code))
                    print("equivalence executed: %d" % cur.rowcount)
                except psycopg2.Error:
                    conn.rollback()
                else:
                    conn.commit()

            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn is not None:
                conn.close()
