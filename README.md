# 📱 Frulo Booking App (Technical Challenge)

**Frulo** is a mobile service booking application built with **React Native**, **Firebase**, and **Expo**. This project was developed by [Samuel Onwodi](https://github.com/Onwodis) as part of a **technical challenge** for a **Senior Software Engineer** role.

🔗 **Live Preview on Expo Go**: [@samon/booking_app](https://expo.dev/@samon/booking_app)

---

## ✅ Features

- 🔐 **Secure Registration & Login** with Firebase Authentication
- ✉️ **Email Verification** on Signup
- 📆 **Slot-Based Booking**: Customers can book services by date and time
- ⚠️ **Smart Conflict Detection**: Warns if a booking already exists for the same hour
- 🧑‍🔧 **Vendor Dashboard**: View, approve, or reject booking requests
- 🧾 **Transaction & Client Records** in Firestore
- 🔁 **Zustand for State Management**
- 🌗 **Cross-Platform Support** (iOS & Android with Expo Go)

---

## 🧪 Admin Credentials (Test)

| Role   | Email                        | Password |
|--------|------------------------------|----------|
| Admin  | `samuelonwodi@gmail.com`     | `123456` |

Use the above credentials to simulate a vendor login.

---

## 🧠 Architecture Overview

| Layer         | Technology         | Purpose                                      |
|---------------|--------------------|----------------------------------------------|
| UI/UX         | React Native       | Cross-platform app interface                 |
| State Store   | Zustand            | Lightweight and reactive state management    |
| Backend Auth  | Firebase Auth      | Email/password login with verification       |
| Database      | Firestore (NoSQL)  | Real-time booking & user records             |
| App Delivery  | Expo Go            | Rapid mobile testing and deployment          |

---

## 📖 Booking Flow

### 👤 Customer
1. Registers with email and password
2. Verifies account via email
3. Books a service
4. Gets alert if the time slot is already taken

### 🧑‍🔧 Vendor
1. Logs in with test admin credentials
2. Views incoming booking requests
3. Approves or rejects each booking
4. Views client details and transactions

---

## ⚠️ Known Limitations

- **📅 Android Calendar Glitch**: The `DateTimePicker` may behave inconsistently on Android. This is device-dependent and will be addressed before production.
- **💳 Paystack Integration**: Payment functionality was omitted due to API key access issues. However, the app is modularly prepared for future integration.

---

## 🚀 Installation & Running

1. Install [Expo Go](https://expo.dev/client) on your mobile device.
2. Open the app using this Expo link: [@samon/booking_app](https://expo.dev/@samon/booking_app)
3. Scan the QR code or search from within Expo Go.

---

## 🔧 Scripts

```bash
# Start development server
npm run start

# Android Preview
npm run android

# iOS Preview
npm run ios
