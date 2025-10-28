from flask import Blueprint, request, jsonify
from models import db, BloodRequest, Donor
from datetime import datetime

blood_request_bp = Blueprint('blood_requests', __name__, url_prefix='/api/blood-requests')

@blood_request_bp.route('/', methods=['POST'])
def create_request():
    try:
        data = request.get_json()

        required_fields = ['name', 'contact', 'bloodGroup', 'units', 'hospitalName', 'city']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        new_request = BloodRequest(
            name=data['name'],
            contact=data['contact'],
            blood_group=data['bloodGroup'],
            units=data['units'],
            hospital_name=data['hospitalName'],
            city=data['city'],
            message=data.get('message', ''),
            status='pending'
        )

        db.session.add(new_request)
        db.session.commit()

        return jsonify({
            'message': 'Blood request submitted successfully',
            'request': new_request.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@blood_request_bp.route('/', methods=['GET'])
def get_all_requests():
    try:
        status = request.args.get('status')
        blood_group = request.args.get('blood_group')

        query = BloodRequest.query

        if status:
            query = query.filter_by(status=status)
        if blood_group:
            query = query.filter_by(blood_group=blood_group)

        requests = query.order_by(BloodRequest.created_at.desc()).all()

        return jsonify({
            'requests': [req.to_dict() for req in requests]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@blood_request_bp.route('/<int:request_id>', methods=['GET'])
def get_request(request_id):
    try:
        blood_request = BloodRequest.query.get(request_id)

        if not blood_request:
            return jsonify({'error': 'Request not found'}), 404

        return jsonify({'request': blood_request.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@blood_request_bp.route('/<int:request_id>', methods=['PUT'])
def update_request(request_id):
    try:
        blood_request = BloodRequest.query.get(request_id)

        if not blood_request:
            return jsonify({'error': 'Request not found'}), 404

        data = request.get_json()

        if 'status' in data:
            blood_request.status = data['status']
        if 'urgency' in data:
            blood_request.urgency = data['urgency']

        blood_request.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Request updated successfully',
            'request': blood_request.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@blood_request_bp.route('/<int:request_id>', methods=['DELETE'])
def delete_request(request_id):
    try:
        blood_request = BloodRequest.query.get(request_id)

        if not blood_request:
            return jsonify({'error': 'Request not found'}), 404

        db.session.delete(blood_request)
        db.session.commit()

        return jsonify({'message': 'Request deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@blood_request_bp.route('/donor/<int:donor_id>', methods=['GET'])
def get_donor_requests(donor_id):
    try:
        requests = BloodRequest.query.filter_by(donor_id=donor_id).order_by(
            BloodRequest.created_at.desc()
        ).all()

        return jsonify({
            'requests': [req.to_dict() for req in requests]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
