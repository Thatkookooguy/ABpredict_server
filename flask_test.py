
from flask import Flask
from flask import request
from flask import jsonify
from csvmapper import FieldMapper, CSVParser
import csvmapper
import pandas as pd
from flask import send_file



Rosetta_path="/home/gideonla/ABpredict_server"

app = Flask(__name__, static_url_path='')



@app.route('/')
def hello_world():
	return app.send_static_file('./index.html')



@app.route('/antibody/<user_id>', methods = ['POST'])
def user(user_id):
	request.method == 'POST'
	content = request.get_json(silent=0)
	print (content['email'])
	print (content['name'])
	print (content['fasta'])

	print(user_id)
	return 'OK'

# Add function to run Rosetta

@app.route('/results', methods = ['GET'])
def display_results():
	# get jobId param
	# check if job exists
	# get and send result or send error
	#make a jason object that returns pdb coordinats and data for graphs

	jobId = request.args.get('jobId')
	return jsonify(pdb=get_pdb_by_jobId(jobId),stats=convert_model_stats_to_json(jobId))

@app.route('/pdbs', methods = ['GET'])
def return_pdb():
	jobId = request.args.get('jobId')
	return send_file("./production_run/"+jobId+"/top_models/tmp.pdb")


def get_pdb_by_jobId(jobId):
	with open("./production_run/"+jobId+"/top_models/tmp.pdb", 'r') as myfile:
		data=myfile.read()
	return data

def convert_model_stats_to_json(jobId):
	parser = CSVParser("./production_run/"+jobId+"/CDR_CO_RMS/cdr_co_rms",hasHeader=True)
	data = parser.buildDict()
	print (type(data))
	return data
