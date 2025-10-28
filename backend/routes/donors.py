from flask import Blueprint, request, jsonify
from models import db, Donor, Donation
from datetime import datetime

donors_bp = Blueprint('donors', __name__, url_prefix='/api/donors')

@donors_bp.route('/', methods=['GET'])
def get_all_donors():
    try:
        status = request.args.get('status')
        blood_group = request.args.get('blood_group')
        city = request.args.get('city')

        query = Donor.query

        if status:
            query = query.filter_by(status=status)
        if blood_group:
            query = query.filter_by(blood_group=blood_group)
        if city:
            query = query.filter_by(city=city)

        donors = query.order_by(Donor.created_at.desc()).all()

        return jsonify({
            'donors': [donor.to_dict() for donor in donors],
            'total': len(donors)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@donors_bp.route('/<int:donor_id>', methods=['GET'])
def get_donor(donor_id):
    try:
        donor = Donor.query.get(donor_id)

        if not donor:
            return jsonify({'error': 'Donor not found'}), 404

        return jsonify({'donor': donor.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@donors_bp.route('/<int:donor_id>', methods=['PUT'])
def update_donor(donor_id):
    try:
        donor = Donor.query.get(donor_id)

        if not donor:
            return jsonify({'error': 'Donor not found'}), 404

        data = request.get_json()

        if 'full_name' in data:
            donor.full_name = data['full_name']
        if 'age' in data:
            donor.age = data['age']
        if 'gender' in data:
            donor.gender = data['gender']
        if 'blood_group' in data:
            donor.blood_group = data['blood_group']
        if 'contact' in data:
            donor.contact = data['contact']
        if 'city' in data:
            donor.city = data['city']
        if 'status' in data:
            donor.status = data['status']
        if 'is_eligible' in data:
            donor.is_eligible = data['is_eligible']

        donor.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Donor updated successfully',
            'donor': donor.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@donors_bp.route('/<int:donor_id>/approve', methods=['POST'])
def approve_donor(donor_id):
    try:
        donor = Donor.query.get(donor_id)

        if not donor:
            return jsonify({'error': 'Donor not found'}), 404

        donor.status = 'approved'
        donor.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Donor approved successfully',
            'donor': donor.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@donors_bp.route('/<int:donor_id>/reject', methods=['POST'])
def reject_donor(donor_id):
    try:
        donor = Donor.query.get(donor_id)

        if not donor:
            return jsonify({'error': 'Donor not found'}), 404

        donor.status = 'rejected'
        donor.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Donor rejected',
            'donor': donor.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@donors_bp.route('/<int:donor_id>/donations', methods=['GET'])
def get_donor_donations(donor_id):
    try:
        donor = Donor.query.get(donor_id)

        if not donor:
            return jsonify({'error': 'Donor not found'}), 404

        donations = Donation.query.filter_by(donor_id=donor_id).order_by(
            Donation.donation_date.desc()
        ).all()

        return jsonify({
            'donations': [donation.to_dict() for donation in donations],
            'total_donations': donor.total_donations
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@donors_bp.route('/<int:donor_id>/donations', methods=['POST'])
def add_donation(donor_id):
    try:
        donor = Donor.query.get(donor_id)

        if not donor:
            return jsonify({'error': 'Donor not found'}), 404

        data = request.get_json()

        new_donation = Donation(
            donor_id=donor_id,
            location=data.get('location', 'Unknown'),
            units=data.get('units', 1),
            donation_date=datetime.strptime(data.get('donation_date', datetime.utcnow().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
            notes=data.get('notes', '')
        )

        donor.total_donations += 1
        donor.last_donation_date = new_donation.donation_date

        db.session.add(new_donation)
        db.session.commit()

        return jsonify({
            'message': 'Donation recorded successfully',
            'donation': new_donation.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@donors_bp.route('/stats', methods=['GET'])
def get_donor_stats():
    try:
        total_donors = Donor.query.count()
        approved_donors = Donor.query.filter_by(status='approved').count()
        pending_donors = Donor.query.filter_by(status='pending').count()

        blood_groups = db.session.query(
            Donor.blood_group,
            db.func.count(Donor.id)
        ).filter_by(status='approved').group_by(Donor.blood_group).all()

        blood_group_distribution = {group: count for group, count in blood_groups}

        return jsonify({
            'total_donors': total_donors,
            'approved_donors': approved_donors,
            'pending_donors': pending_donors,
            'blood_group_distribution': blood_group_distribution
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
