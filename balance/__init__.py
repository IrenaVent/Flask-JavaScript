from flask import Flask

app = Flask(__name__)

from balance.views import *