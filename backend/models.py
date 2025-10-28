from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import bcrypt

db = SQLAlchemy()

class Donor(db.Model):
    __tablename__ = 'donors'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False)
    contact = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    city = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='pending')
    is_eligible = db.Column(db.Boolean, default=True)
    last_donation_date = db.Column(db.Date, nullable=True)
    total_donations = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    donations = db.relationship('Donation', backref='donor', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'age': self.age,
            'gender': self.gender,
            'blood_group': self.blood_group,
            'contact': self.contact,
            'email': self.email,
            'city': self.city,
            'status': self.status,
            'is_eligible': self.is_eligible,
            'last_donation_date': self.last_donation_date.isoformat() if self.last_donation_date else None,
            'total_donations': self.total_donations,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class BloodRequest(db.Model):
    __tablename__ = 'blood_requests'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(20), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False)
    units = db.Column(db.Integer, nullable=False)
    hospital_name = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='pending')
    urgency = db.Column(db.String(20), default='normal')
    donor_id = db.Column(db.Integer, db.ForeignKey('donors.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact': self.contact,
            'blood_group': self.blood_group,
            'units': self.units,
            'hospital_name': self.hospital_name,
            'city': self.city,
            'message': self.message,
            'status': self.status,
            'urgency': self.urgency,
            'donor_id': self.donor_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Donation(db.Model):
    __tablename__ = 'donations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('donors.id'), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    units = db.Column(db.Integer, default=1)
    status = db.Column(db.String(20), default='completed')
    donation_date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'donor_id': self.donor_id,
            'location': self.location,
            'units': self.units,
            'status': self.status,
            'donation_date': self.donation_date.isoformat() if self.donation_date else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Admin(db.Model):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), default='admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role
        }


class BloodStock(db.Model):
    __tablename__ = 'blood_stock'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    blood_group = db.Column(db.String(5), unique=True, nullable=False)
    units_available = db.Column(db.Integer, default=0)
    units_reserved = db.Column(db.Integer, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'blood_group': self.blood_group,
            'units_available': self.units_available,
            'units_reserved': self.units_reserved,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }
