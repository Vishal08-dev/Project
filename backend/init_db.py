from app import create_app
from models import db, Admin, BloodStock
import sys

def initialize_database():
    app = create_app()

    with app.app_context():
        try:
            print("Creating database tables...")
            db.create_all()
            print("Database tables created successfully!")

            existing_admin = Admin.query.filter_by(email='admin@bloodlink.org').first()
            if not existing_admin:
                print("\nCreating default admin user...")
                admin = Admin(
                    username='admin',
                    email='admin@bloodlink.org',
                    full_name='System Administrator',
                    role='admin'
                )
                admin.set_password('admin123')
                db.session.add(admin)
                print("Default admin created:")
                print("  Email: admin@bloodlink.org")
                print("  Password: admin123")
            else:
                print("\nAdmin user already exists")

            blood_groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
            for group in blood_groups:
                existing_stock = BloodStock.query.filter_by(blood_group=group).first()
                if not existing_stock:
                    stock = BloodStock(
                        blood_group=group,
                        units_available=100,
                        units_reserved=0
                    )
                    db.session.add(stock)

            db.session.commit()
            print("\nBlood stock initialized for all blood groups")

            print("\n" + "="*50)
            print("DATABASE INITIALIZATION COMPLETE!")
            print("="*50)
            print("\nYou can now start the Flask server with:")
            print("  python app.py")
            print("\nDefault admin credentials:")
            print("  Email: admin@bloodlink.org")
            print("  Password: admin123")
            print("\nIMPORTANT: Change the admin password after first login!")
            print("="*50)

        except Exception as e:
            print(f"\nError initializing database: {e}")
            db.session.rollback()
            sys.exit(1)

if __name__ == '__main__':
    initialize_database()
