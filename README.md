# CSI SRMCEM × D’CODERS — Official Website 3.0

> The official digital platform and management portal of the **Computer Society of India (CSI) Student Chapter, SRMCEM Lucknow × D’CODERS Technical Club**.

---

## 🚀 About the Project

**CSI SRMCEM × D’CODERS — Official Website 3.0** is a complete rebuild of our community's digital platform, developed with a stronger focus on **performance, reliability, scalability, security, and content management**.

Version 3.0 was created as a fresh implementation to overcome performance, data-rendering, synchronization, and reliability limitations encountered in earlier versions.

The platform serves as both:

- 🌐 A public-facing technical community website
- ⚙️ A centralized administrative CMS
- 📅 An event and activity management platform
- 👥 A team and organizational hierarchy showcase
- 📰 A digital hub for newsletters, news, gallery, and community initiatives

---

## ✨ Key Features

### ⚡ High-Performance Data Rendering
Optimized data architecture with a lightweight in-memory `DataStore` layer for fast initial rendering while maintaining Supabase as the primary backend data source.

### 🔐 Production-Ready Row Level Security
Supabase **Row Level Security (RLS)** protects application data with:

- Public `SELECT` access for website content
- Authenticated admin access for `INSERT`
- Authenticated admin access for `UPDATE`
- Authenticated admin access for `DELETE`
- JWT-based authorization through Supabase Auth

### 📅 Smart Event Auto-Transition
Events automatically move between:

```text
Upcoming Events → Past Events
