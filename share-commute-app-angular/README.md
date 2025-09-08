# 🚗 Transport Facility Management – Share Commute App

This is a simple Angular-based ride-sharing application designed for employees within an organization to add and pick rides easily. The app demonstrates key Angular concepts like routing, forms, signals, session storage, and guarded routes while allowing users to share commute information efficiently.

---

## 📂 Project Structure

The project is built using Angular with standalone components and structured to ensure separation of concerns, code reusability, and maintainability. Dummy ride data is provided through a JSON file and fetched using session storage.

---

## ✅ Features

* ✅ **Add a Ride**
  Employees can create a new ride by filling out a form with vehicle details, pickup and destination points, time, etc.

* ✅ **Pick a Ride**
  Employees can view available rides and book one based on their needs.

* ✅ **Employee ID Validation**
  Users must enter a valid Employee ID to create or pick rides.
  The ID is entered once on the home page and automatically passed to the Add Ride and Pick Ride pages.

* ✅ **Routing and Guards**
  Protected routes ensure users cannot access Add Ride or Pick Ride pages without entering a valid Employee ID.

* ✅ **Dummy Data**
  Sample rides are provided in a JSON file and fetched using session storage to simulate real-world data without a backend.

* ✅ **Form Validations**
  Input fields are validated to ensure correct formats (e.g., vehicle number, pickup point, etc.).

* ✅ **Styling**
  The UI is styled with a clean, responsive layout for ease of use.

---

## 📖 Instructions to Use the App

### 1. **Enter Employee ID**

* Upon loading the app, users will be asked to enter their Employee ID.
* This ID is required to create or pick rides.
* Once entered, the ID is saved and automatically passed to the Add Ride and Pick Ride pages.

### 2. **Add a Ride**

* Navigate to the "Add Ride" page.
* The Employee ID field is pre-filled and read-only.
* Fill out the form with vehicle type, number, vacant seats, pickup point, destination, and time.
* Submit the form to add the ride.

### 3. **Pick a Ride**

* Navigate to the "Pick Ride" page.
* Available rides will be displayed based on the dummy data.
* You can filter rides by vehicle type.
* Book a ride, confirm or cancel, and return to the home page.

---

## ⚙ How the Data Works

* ✅ **Dummy Data** is stored in `dummy-rides.json`.
* ✅ **Session Storage** is used to fetch and persist data throughout the user session.
* ✅ This approach simulates real backend functionality for development purposes.

---

## 📂 Technologies Used

* Angular (Standalone Components)
* Angular Routing and Guards
* Reactive Forms
* Session Storage
* TypeScript
* HTML, CSS

---

## 📥 How to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Vedapramod/Transport-Facility-Management.git
   ```

2. Navigate to the Angular project folder:

   ```bash
   cd Transport-Facility-Management/share-commute-app-angular
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the application:

   ```bash
   ng serve
   ```

5. Open the browser at `http://localhost:4200/`.

---

## 📦 Deployment

The application is successfully deployed using GitHub Pages and is publicly accessible at:
https://vedapramod.github.io/Transport-Facility-Management/

---

## 📢 Notes

* Ensure that the Employee ID entered is valid before proceeding.
* The app currently uses static dummy data and session storage for demonstration purposes.
* Future enhancements can include backend integration and persistent storage.

---

