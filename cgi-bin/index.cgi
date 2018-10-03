#!/usr/bin/python

from wsgiref.handlers import CGIHandler
from courses import app
CGIHandler().run(app)
