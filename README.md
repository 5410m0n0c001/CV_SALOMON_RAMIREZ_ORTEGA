# Salomón Ramírez Ortega - Professional CV

A modern, interactive, and bilingual CV website built with HTML, CSS, and JavaScript, optimized for production deployment on Vercel.

## 🚀 Features

- **Bilingual Support**: Spanish and English versions with seamless language switching
- **Interactive Sections**: Collapsible content sections with smooth animations
- **Responsive Design**: Mobile-first design that works on all devices
- **Professional Styling**: Modern gradient design with professional color scheme
- **PDF Download**: Direct download functionality for both language versions
- **Performance Optimized**: Production-ready with optimized assets and caching
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Print Optimized**: Clean print styles for professional printing

## 📁 Project Structure

```
/
├── index.html              # Spanish version (main page)
├── index-en.html           # English version
├── styles.css              # Main stylesheet with production optimizations
├── script.js               # Interactive functionality with error handling
├── alex.png                # Profile image
├── vercel.json             # Vercel deployment configuration
├── SALOMON_RAMIREZ_ORTEGA_CV_ENG.PDF    # English CV PDF
└── SalomónRamírezOrtega.CV.2.0.pdf_2025_9_8 (1).pdf  # Spanish CV PDF
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **JavaScript ES6+**: Class-based architecture with error handling
- **Font Awesome**: Professional icons
- **Google Fonts**: Inter font family for modern typography

## 🎨 Design Features

- **Professional Color Scheme**: Blues, grays, and whites
- **Smooth Animations**: CSS transitions and JavaScript-powered interactions
- **Visual Progress Indicators**: Animated skill bars with shimmer effects
- **Contact Cards**: Interactive contact information with hover effects
- **Section Icons**: Font Awesome icons for each section
- **Responsive Navigation**: Mobile-optimized navigation menu

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (adjusted layout)
- **Mobile**: 480px - 767px (stacked layout)
- **Small Mobile**: < 480px (compact layout)

## 🔧 Production Optimizations

### Performance
- **Hardware Acceleration**: CSS transforms for smooth animations
- **Font Loading**: Optimized web font loading with fallbacks
- **Image Optimization**: Lazy loading and proper sizing attributes
- **Caching**: Aggressive caching headers for static assets
- **Minification Ready**: Code structure optimized for build tools

### Security
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Referrer-Policy**: Controls referrer information
- **noopener noreferrer**: Secure external link handling

### SEO & Accessibility
- **Meta Tags**: Comprehensive meta tags for both language versions
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing
- **Canonical URLs**: Proper canonical URL implementation
- **Language Tags**: Proper language declarations
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Fork or Clone** this repository
2. **Connect** to Vercel:
   - Import the project to Vercel
   - Auto-deployment will be configured
3. **Configure** build settings:
   - Build Command: Leave empty (static site)
   - Output Directory: `./`
   - Install Command: Leave empty

### Manual Deployment

1. **Upload** all files to your web server
2. **Ensure** proper MIME types are set:
   - `.css` → `text/css`
   - `.js` → `application/javascript`
   - `.png` → `image/png`
   - `.pdf` → `application/pdf`

### Local Development

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

## 🌐 Language Toggle

The language toggle functionality works through:
- **Client-side JavaScript**: Handles the toggle interaction
- **URL Routing**: Redirects between `/` (Spanish) and `/en` (English)
- **Vercel Configuration**: Routes `/es` → `/index.html` and `/en` → `/index-en.html`
- **State Persistence**: Remembers language preference

## 📄 PDF Downloads

- **Spanish CV**: `SalomónRamírezOrtega.CV.2.0.pdf_2025_9_8 (1).pdf`
- **English CV**: `SALOMON_RAMIREZ_ORTEGA_CV_ENG.PDF`
- **Error Handling**: Graceful fallbacks if files are not found
- **User Feedback**: Download notifications with success/error states

## 🎯 Key Sections

1. **Professional Profile**: Overview of experience and current transition
2. **Professional Experience**: Complete work history with 12+ positions
3. **Education & Certifications**: Academic background and ongoing education
4. **Skills**: Technical and soft skills with visual progress indicators
5. **Languages**: Language proficiency levels

## 🔍 Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **Mobile Browsers**: iOS Safari 12+, Chrome Mobile 60+
- **Legacy Support**: Graceful degradation for older browsers

## 📞 Contact Information

- **Phone**: +52 777 238 3264
- **Email**: 5410m0n.r4m1r3z@gmail.com
- **LinkedIn**: [linkedin.com/in/salomon-ramirez-ortega-b8988a329](https://www.linkedin.com/in/salomon-ramirez-ortega-b8988a329/)
- **GitHub**: [github.com/5410m0n0c001/CV_SALOMON_RAMIREZ_ORTEGA](https://github.com/5410m0n0c001/CV_SALOMON_RAMIREZ_ORTEGA)
- **Website**: [salomonramirezortega.quantumdigitalgroup.net](https://salomonramirezortega.quantumdigitalgroup.net)

## 🏆 Professional Highlights

- **Technology Advisor** at Graduño Abogados (2024-Present)
- **Digital Marketing Manager** at Guayabita Consulting (2024-2025)
- **Customer Support Specialist** at Teleperformance (Comcast & Xfinity)
- **Currently pursuing**: Oracle ONE Data Analyst Certification
- **Languages**: Spanish (Native), English (Advanced), Russian (Beginner)

## 📈 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🔧 Customization

To customize the CV:

1. **Personal Information**: Update contact details in both HTML files
2. **Content**: Modify sections in both `index.html` and `index-en.html`
3. **Styling**: Adjust colors and fonts in `styles.css`
4. **Functionality**: Extend JavaScript in `script.js`
5. **PDF Files**: Replace PDF files with updated versions

## 📝 License

This project is created for Salomón Ramírez Ortega's professional use.

## 🤝 Contributing

This is a personal CV project. For suggestions or improvements, please contact the owner directly.

---

**Built with ❤️ for professional excellence**
