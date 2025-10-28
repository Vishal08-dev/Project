from flask import Blueprint, request, jsonify
from models import db, Admin, Donor, BloodRequest, BloodStock, Donation
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        total_donors = Donor.query.count()
        total_requests = BloodRequest.query.count()
        approved_requests = BloodRequest.query.filter_by(status='approved').count()
        pending_requests = BloodRequest.query.filter_by(status='pending').count()
        total_donations = Donation.query.count()

        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_donors = Donor.query.filter(Donor.created_at >= thirty_days_ago).count()
        recent_requests = BloodRequest.query.filter(BloodRequest.created_at >= thirty_days_ago).count()

        blood_groups_count = db.session.query(
            Donor.blood_group,
            db.func.count(Donor.id)
        ).filter_by(status='approved').group_by(Donor.blood_group).all()

        return jsonify({
            'total_donors': total_donors,
            'total_requests': total_requests,
            'approved_requests': approved_requests,
            'pending_requests': pending_requests,
            'total_donations': total_donations,
            'recent_donors': recent_donors,
            'recent_requests': recent_requests,
            'blood_group_distribution': {group: count for group, count in blood_groups_count}
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/donors/pending', methods=['GET'])
def get_pending_donors():
    try:
        donors = Donor.query.filter_by(status='pending').order_by(
            Donor.created_at.desc()
        ).all()

        return jsonify({
            'donors': [donor.to_dict() for donor in donors]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/requests/pending', methods=['GET'])
def get_pending_requests():
    try:
        requests = BloodRequest.query.filter_by(status='pending').order_by(
            BloodRequest.created_at.desc()
        ).all()

        return jsonify({
            'requests': [req.to_dict() for req in requests]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/blood-stock', methods=['GET'])
def get_blood_stock():
    try:
        stock = BloodStock.query.all()

        if not stock:
            blood_groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
            for group in blood_groups:
                new_stock = BloodStock(blood_group=group, units_available=0)
                db.session.add(new_stock)
            db.session.commit()
            stock = BloodStock.query.all()

        return jsonify({
            'stock': [s.to_dict() for s in stock]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/blood-stock/<int:stock_id>', methods=['PUT'])
def update_blood_stock(stock_id):
    try:
        stock = BloodStock.query.get(stock_id)

        if not stock:
            return jsonify({'error': 'Stock not found'}), 404

        data = request.get_json()

        if 'units_available' in data:
            stock.units_available = data['units_available']
        if 'units_reserved' in data:
            stock.units_reserved = data['units_reserved']

        stock.last_updated = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Blood stock updated successfully',
            'stock': stock.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/requests/<int:request_id>/approve', methods=['POST'])
def approve_request(request_id):
    try:
        blood_request = BloodRequest.query.get(request_id)

        if not blood_request:
            return jsonify({'error': 'Request not found'}), 404

        blood_request.status = 'approved'
        blood_request.updated_at = datetime.utcnow()

        stock = BloodStock.query.filter_by(blood_group=blood_request.blood_group).first()
        if stock and stock.units_available >= blood_request.units:
            stock.units_available -= blood_request.units

        db.session.commit()

        return jsonify({
            'message': 'Request approved successfully',
            'request': blood_request.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/requests/<int:request_id>/reject', methods=['POST'])
def reject_request(request_id):
    try:
        blood_request = BloodRequest.query.get(request_id)

        if not blood_request:
            return jsonify({'error': 'Request not found'}), 404

        blood_request.status = 'rejected'
        blood_request.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Request rejected',
            'request': blood_request.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/reports/monthly', methods=['GET'])
def get_monthly_report():
    try:
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)

        new_donors = Donor.query.filter(Donor.created_at >= thirty_days_ago).count()
        new_requests = BloodRequest.query.filter(BloodRequest.created_at >= thirty_days_ago).count()
        new_donations = Donation.query.filter(Donation.created_at >= thirty_days_ago).count()

        return jsonify({
            'period': '30_days',
            'new_donors': new_donors,
            'new_requests': new_requests,
            'new_donations': new_donations,
            'generated_at': datetime.utcnow().isoformat()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
