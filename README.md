# 📱 Frulo Booking App (Test Build)

Frulo is a **mobile service booking application** built using **React Native** and **Firebase**. This application was developed as part of a **technical challenge** for a **Senior Developer role** by [Samuel Onwodi](https://github.com/Onwodis). It showcases practical skills in mobile app development, firebase user authentication, real-time Firestore interaction, and structured UI design.

> 🚀 **Live Preview (Expo Go)**: [@samon/booking](https://expo.dev/@samon/booking_app)

---

## ✨ Features

- 🔐 **Customer Registration & Authentication**
- 👥 **Role-based Login** (Admin/Vendor & Customer)
- 📆 **Service Booking with Time Slot Management**
- ⚠️ **Conflict Detection**: Customers are notified if they attempt to book a service already scheduled in the same hour
- 🗓️ **Date & Time Picker** (Android note below)
- 💬 **Booking Status Updates**: Pending, Approved, Rejected
- 📦 **Firestore-based Data Management**
- 🛠️ **Zustand for State Management**
- 📂 **Modular & Clean Code Structure**

---

## 📌 Admin Test Credentials

Email: samuelonwodi@gmail.com
Password: 123456


> Use the above credentials to log in as the admin (vendor) and approve or reject incoming booking requests.

---

## ⚙️ Tech Stack

| Tech           | Purpose                                    |
|----------------|--------------------------------------------|
| **React Native**   | Cross-platform mobile development          |
| **Expo**           | Simplified development & testing workflow |
| **Firebase Auth**  | Secure user authentication                |
| **Firestore DB**   | Cloud NoSQL database for bookings, users  |
| **Zustand**        | Global state management                   |
| **TypeScript**     | Safer code with static typing             |

---

## 🔄 Booking Flow

### ✅ Customer
1. Register with a valid email and password
2. Select a service, choose a time & date
3. Submit booking request
4. Get notified if the slot is unavailable

### 🔧 Admin (Vendor)
1. Login via test credentials
2. View all pending bookings
3. Approve or reject requests

---

## ⚠️ Known Issues

- **📅 Android DateTimePicker**: Calendar view may not render as expected on some Android devices. A fallback mode is advised in future iterations.
- **💳 Paystack Integration Skipped**: Payment gateway logic was not implemented to focus on core app flow for the test. Payment intent stubs are in place.

---

## 📲 How to Run

1. Install **Expo Go** on your mobile device (Android or iOS)
2. Scan this QR code from the [project page](https://expo.dev/@samon/booking)  
   OR open it manually in the Expo Go app:
