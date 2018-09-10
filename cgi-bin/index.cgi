#!/usr/bin/python3

from wsgiref.handlers import CGIHandler
from courses import app

CGIHandler().run(app)

