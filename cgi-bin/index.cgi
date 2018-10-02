#!/usr/bin/python
from wsgiref.handlers import CGIHandler
print "Content-Type: text/plain;charset=utf-8"
from courses import app
CGIHandler().run(app)

