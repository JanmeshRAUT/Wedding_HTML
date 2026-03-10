# Event Planner - Basic HTML/CSS/JavaScript Version

A simple and clean event planning application built with basic HTML, CSS, and JavaScript with a Node.js Express server.

## Features

- 📅 **Booking Management** - Create and manage event bookings
- 🏢 **Vendor Management** - Add and manage vendors with contact information
- 💰 **Budget Tracking** - Track event budget and expenses
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Clean and beautiful user interface

## Project Structure

```
EventPlanner-Basic/
├── public/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── style.css       # Styling
│   ├── js/
│   │   └── main.js         # JavaScript functionality
│   └── images/             # Image folder
├── server.js               # Express server
├── package.json            # Project dependencies
└── README.md               # This file
```

## Requirements

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Navigate to the project folder:
   ```bash
   cd EventPlanner-Basic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at: **http://localhost:3000**

## Deploy to Vercel (Only EventPlanner-Basic)

1. In Vercel, import the GitHub repository.
2. Set **Root Directory** to `EventPlanner-Basic`.
3. Keep default install command (`npm install`).
4. Deploy.

This folder includes `vercel.json` so all routes are handled by `server.js`.

## Features Overview

### Home Page
- Welcome section with feature highlights
- Quick overview of the application

### Bookings
- Add new event bookings with date, location, and guest count
- View all bookings
- Delete bookings

### Vendors
- Add vendor information (name, service type, contact, price)
- Manage vendor list
- Delete vendors

### Budget
- Set total event budget
- Track amount spent
- View remaining budget
- Visual progress indicator

### Contact
- Send contact messages
- Get in touch with the support team

## API Routes

The server provides the following REST API endpoints:

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Create new vendor
- `GET /api/budget` - Get budget info
- `POST /api/budget` - Update budget

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Styling**: CSS Grid, Flexbox, Gradients
- **API**: REST API with JSON

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Customization

- **Colors**: Edit `:root` variables in `public/css/style.css`
- **Content**: Modify `public/index.html`
- **Functionality**: Update `public/js/main.js`
- **Server Routes**: Modify `server.js`

## Future Enhancements

- Database integration (SQLite, MongoDB)
- User authentication
- Image upload for vendors
- PDF export for budgets
- Email notifications
- Payment integration
- Admin panel

## License

MIT License - Feel free to use this project for your needs!

## Support

For issues or questions, please create an issue or contact support.

---

**Built with ❤️ for event planners**
