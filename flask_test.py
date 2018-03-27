from flask import Flask
from flask import request
from flask import jsonify

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
	print (jobId)
	return jsonify(
        username="bla"

    )
