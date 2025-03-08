import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  SunIcon,
  HeartIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  MoonIcon,
  PlayIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { useFormik } from 'formik';
import { HfInference } from '@huggingface/inference';


// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Dark Mode Context
const DarkModeContext = createContext();  

// ================== Components ==================
const navLinkStyle = (isDarkMode, isActive) => 
  `hover:text-blue-500 transition-colors ${
    isActive ? 'text-blue-600' : 
    isDarkMode ? 'text-gray-300' : 'text-gray-700'
  }`;

  const Navbar = () => {
    const { isDarkMode, toggleDarkMode, user } = useContext(DarkModeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    return (
      <nav className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg py-4 px-8`}>
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            MAKARIY
          </Link>
  
          <div className="hidden md:flex gap-8 items-center">
            <NavLink to="/" className={({ isActive }) => navLinkStyle(isDarkMode, isActive)}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => navLinkStyle(isDarkMode, isActive)}>
              Tentang Kami
            </NavLink>
            <NavLink to="/media" className={({ isActive }) => navLinkStyle(isDarkMode, isActive)}>
              Media
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => navLinkStyle(isDarkMode, isActive)}>
              Kontak
            </NavLink>
          </div>
  
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-black bg-white border-black border-2'}`}
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-white hover:fill-white fill-black" />
              )}
            </button>
            
            {user ? (
              <ProfileDropdown />
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                Masuk
              </Link>
            )}
          </div>
        </div>
      </nav>
    );
  };

  const Footer = () => (
    <footer className="bg-gray-800 text-white py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">MAKARIY</h3>
          <p>Mewujudkan Akses Makanan Bergizi untuk Semua Anak di Indonesia</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Tautan Cepat</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-blue-400">Tentang Kami</Link></li>
            <li><Link to="/media" className="hover:text-blue-400">Artikel</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400">Hubungi Kami</Link></li>
          </ul>
        </div>
  
        <div>
          <h4 className="font-semibold mb-4">Program Kami</h4>
          <ul className="space-y-2">
            <li><Link to="/programs" className="hover:text-blue-400">Makan Siang Gratis</Link></li>
            <li><Link to="/programs" className="hover:text-blue-400">Edukasi Gizi</Link></li>
            <li><Link to="/volunteer" className="hover:text-blue-400">Program Relawan</Link></li>
          </ul>
        </div>
  
        <div>
          <h4 className="font-semibold mb-4">Berlangganan</h4>
          <div className="flex flex-col gap-2">
            <input 
              type="email" 
              placeholder="Masukkan email Anda"
              className="p-2 rounded text-white w-full"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );

  export const HeroSection = () => {
    const { isDarkMode } = useContext(DarkModeContext);
  
    return (
      <section className={`relative h-[80vh] ${isDarkMode ? 'bg-gray-800' : 'bg-blue-600'} text-white`}>
        <div className="container h-full flex items-center">
          <div className="max-w-2xl z-10 pl-8 md:pl-12"> {/* Added padding-left */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Makan Gratis, Penuhi Potensi Siswa
            </h1>
            <p className="text-xl mb-8">
              Program makan gratis untuk memastikan setiap siswa mendapatkan makanan bergizi
            </p>
            <button className={`px-8 py-3 rounded-full ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-gray-100'
            }`}>
              Pelajari Lebih Lanjut
            </button>
          </div>
          <img 
            src="/hero-image.png" 
            alt="Happy children" 
            className="absolute right-0 bottom-0 h-full object-cover max-w-[50%]"
          />
        </div>
      </section>
    );
  };

const FeaturesSection = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4">Distribusi Makanan Sehat</h3>
        <p>Menyediakan makan siang gratis bagi anak-anak sekolah yang membutuhkan</p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4">Pengiriman Mingguan</h3>
        <p>Mengantarkan makanan ke berbagai sekolah setiap minggu</p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4">Edukasi Gizi</h3>
        <p>Sesi edukasi tentang pentingnya makanan sehat dan pola makan baik</p>
      </div>
    </div>
  </section>
);

const ProgramGrid = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  
  return (
    <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Program Kami
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`p-8 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {program.title}
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {program.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
const ProgramSection = ProgramGrid;
const StatsSection = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  
  return (
    <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Pencapaian Kami
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {['34M+ Makanan', '400+ Sekolah', '20+ Provinsi'].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}
            >
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {stat}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`relative h-[80vh] ${isDarkMode ? 'bg-gray-800' : 'bg-blue-600'} text-white`}
      >
        <div className="container mx-auto h-full flex items-center px-4">
          <motion.div 
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            className="max-w-2xl z-10 pl-8 md:pl-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Makan Gratis,<br />
              Penuhi Potensi<br />
              Siswa
            </h1>
            <Link 
              to="/projects" 
              className={`inline-block px-8 py-3 rounded-full text-lg ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white text-blue-600 hover:bg-gray-100'
              } transition-colors`}
            >
              Pelajari Lebih Lanjut
            </Link>
          </motion.div>
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            src="/hero-image.jpg" 
            alt="Happy children"
            className="absolute right-0 bottom-0 h-full object-cover max-w-[50%]"
          />
        </div>
      </motion.section>

      {/* Divider */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className={`h-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
      />

      {/* Program Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Makanan Gratis untuk Setiap Siswa
            </h2>
            <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Program makan gratis ini dirancang untuk memastikan setiap siswa di sekolah dapat menikmati makanan bergizi tanpa biaya. 
              Kami bekerja sama dengan sekolah-sekolah untuk menyediakan makanan sehat, mendukung kesejahteraan siswa, dan membantu 
              mereka belajar dengan fokus penuh. Dengan akses pangan yang lebih baik, kami berharap siswa dapat tumbuh dengan energi 
              positif dan meraih prestasi maksimal di sekolah.
            </p>
            <Link 
              to="/projects" 
              className={`hover:underline font-semibold ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}
            >
              Pelajari Lebih Lanjut →
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Tujuan Program */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Tujuan Program
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Fasilitas untuk Siswa',
                content: 'Memastikan setiap siswa mendapatkan makanan bergizi secara terjangkau',
                icon: <SunIcon className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
              },
              {
                title: 'Kesejahteraan Siswa',
                content: 'Program ini memastikan siswa mendapatkan makanan bergizi untuk kesehatan',
                icon: <HeartIcon className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
              },
              {
                title: 'Konsentrasi Belajar',
                content: 'Dengan makanan yang cukup, siswa dapat fokus lebih baik dalam belajar',
                icon: <AcademicCapIcon className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
              },
              {
                title: 'Akses Pangan untuk Semua',
                content: 'Memberikan makanan gratis tanpa hambatan finansial',
                icon: <GlobeAltIcon className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-blue-600' : 'bg-blue-100'
                }`}>
                  {item.icon}
                </div>
                <h3 className={`text-xl font-semibold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Yang Kami Lakukan */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Yang Kami Lakukan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Distribusi Makanan Sehat',
                subtitle: 'Program Makan Siang Gratis',
                content: 'Menyediakan makan siang gratis bagi anak-anak sekolah yang membutuhkan',
                image: '/food-distribution.jpg'
              },
              {
                title: 'Pengiriman Mingguan',
                subtitle: 'Untuk Semua Sekolah',
                content: 'Mengantarkan makanan ke sekolah terdaftar setiap minggu',
                image: '/delivery.jpg'
              },
              {
                title: 'Edukasi Gizi',
                subtitle: 'Pola Makan Sehat',
                content: 'Sesi edukasi tentang pentingnya makanan sehat dan kebiasaan baik',
                image: '/education.jpg'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                }`}
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                  {item.subtitle && (
                    <span className="block text-blue-600 mt-1">{item.subtitle}</span>
                  )}
                </h3>
                <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className={`relative py-16 bg-blue-600 text-white`}
      >
        <div className="absolute inset-0 bg-[url('/public/texture.png')] opacity-90"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-bold mb-8">Jadilah Bagian dari Gerakan Peduli Anak!</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/registration"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                Gabung sebagai Relawan
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <button className="bg-transparent border border-white px-8 py-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors">
                Ajak Teman
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Jadwal Kegiatan */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Jadwal Kegiatan
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                date: '13 APR',
                title: 'Makan Siang Bersama',
                subtitle: 'Peduli & Berbagi',
                description: 'Acara makan siang bersama dengan siswa dan relawan'
              },
              {
                date: '25 APR',
                title: 'Seminar: Pentingnya Gizi',
                subtitle: 'Seimbang untuk Anak',
                description: 'Diskusi tentang pola makan sehat untuk anak-anak'
              }
            ].map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex gap-6">
                  <div className={`text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    <div className="text-2xl font-bold">{event.date}</div>
                    <div className="text-sm">NEXT EVENTS</div>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {event.title}
                      <span className="block text-blue-600">{event.subtitle}</span>
                    </h3>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const RegistrationPage = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Informasi Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16"
      >
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Left Column */}
          <motion.div 
            initial={{ x: -50 }}
            whileInView={{ x: 0 }}
            className={`space-y-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Daftarkan Sekolah Anda!
            </h2>
            <p>
              Bersama, kita bisa menciptakan masa depan yang lebih baik bagi anak-anak. 
              Daftarkan sekolah Anda dan jadilah bagian dari program yang mendukung 
              pendidikan dan kesejahteraan siswa.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Let's talk!</h3>
                <p>+62 812 3456 7890</p>
                <p>kontak@makariy.org</p>
              </div>
              <div>
                <h3 className="font-semibold">Headoffice</h3>
                <p>Jl. Sudirman No. 123, Jakarta Selatan</p>
              </div>
              <div>
                <h3 className="font-semibold">Branch Office</h3>
                <p>Jl. Gatot Subroto No. 456, Bandung</p>
              </div>
            </div>

            {/* Social Logos */}
            {/* Social Media */}
            <div className="mt-8 flex gap-4">
              {['facebook', 'instagram', 'twitter', 'linkedin'].map((platform) => (
                <a 
                  key={platform}
                  href={`#${platform}`}
                  className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
                >
                  <img 
                    src={`/${platform}-icon.svg`} 
                    alt={platform} 
                    className="w-6 h-6"
                  />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div 
            initial={{ x: 50 }}
            whileInView={{ x: 0 }}
            className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <Formik
              initialValues={{ 
                schoolName: '', 
                address: '', 
                contactEmail: '', 
                phoneNumber: '',
                studentCount: '',
                message: ''
              }}
              onSubmit={(values, { setSubmitting }) => {
                console.log(values);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Nama Sekolah
                    </label>
                    <Field
                      name="schoolName"
                      type="text"
                      className={`w-full p-4 border rounded-lg ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white text-black'
                      }`}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Alamat Sekolah
                    </label>
                    <Field
                      name="address"
                      as="textarea"
                      className={`w-full p-4 border rounded-lg ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white text-black'
                      }`}
                    />
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Email Kontak
                      </label>
                      <Field
                        name="contactEmail"
                        type="email"
                        className={`w-full p-4 border rounded-lg ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white text-black'
                        }`}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Nomor Telepon
                      </label>
                      <Field
                        name="phoneNumber"
                        type="tel"
                        className={`w-full p-4 border rounded-lg ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white text-black'
                        }`}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Jumlah Siswa
                    </label>
                    <Field
                      name="studentCount"
                      type="number"
                      className={`w-full p-4 border rounded-lg ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white text-black'
                      }`}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Pesan Tambahan
                    </label>
                    <Field
                      name="message"
                      as="textarea"
                      className={`w-full p-4 border rounded-lg ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white text-black'
                      }`}
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Kirim Permohonan
                    </button>
                  </motion.div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </div>
      </motion.section>

      {/* Map Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="h-96 bg-gray-200"
      >
        <img 
          src="/map-placeholder.jpg" 
          alt="Lokasi Sekolah" 
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
};

const ProjectsPage = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  
  const projects = [
    {
      title: "Program Sekolah Dasar",
      location: "Jakarta Pusat",
      meals: 12500,
      schools: 8,
      image: "/project-school.jpg",
      description: "Program makan siang untuk siswa SD kurang mampu di wilayah Jakarta Pusat"
    },
    {
      title: "Daerah Terpencil",
      location: "Papua Barat",
      meals: 8400,
      schools: 5,
      image: "/project-rural.jpg",
      description: "Distribusi makanan bergizi ke sekolah-sekolah terpencil"
    },
    {
      title: "Pasca Bencana",
      location: "Palu, Sulawesi",
      meals: 15600,
      schools: 12,
      image: "/project-disaster.jpg",
      description: "Bantuan makanan darurat untuk anak-anak korban bencana alam"
    }
  ];

  const stats = [
    { id: 1, name: 'Total Makanan Disalurkan', value: '34M+', icon: HeartIcon },
    { id: 2, name: 'Sekolah Terdaftar', value: '400+', icon: UserGroupIcon },
    { id: 3, name: 'Provinsi Terjangkau', value: '20+', icon: GlobeAltIcon },
    { id: 4, name: 'Tahun Beroperasi', value: '5+', icon: CalendarIcon }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative py-24 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className={`text-4xl md:text-6xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Program Makan Siang Gratis
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xl md:text-2xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Membantu menyediakan makanan bergizi untuk anak-anak Indonesia sejak 2018
          </motion.p>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <stat.icon className={`h-12 w-12 mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Proyek Terkini
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`overflow-hidden rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <GlobeAltIcon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{project.location}</p>
                </div>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{project.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-blue-600'}`}>Makanan</p>
                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {project.meals.toLocaleString()}+
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-blue-600'}`}>Sekolah</p>
                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {project.schools}+
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Tentang Kami Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
          <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Tentang Kami
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.p 
                whileHover={{ scale: 1.02 }}
                className={`${isDarkMode ? 'text-gray-300 text-3xl font-bold' : 'text-gray-600 text-3xl font-bold'}`}
              >
                Makanan Bergizi dan Masa Depan Cerah
              </motion.p>
              <motion.p 
                whileHover={{ scale: 1.02 }}
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Program Makan Siang Gratis ini didedikasikan untuk menyediakan makanan bergizi bagi anak-anak sekolah di seluruh negeri. Kami percaya bahwa setiap anak berhak mendapatkan asupan gizi yang cukup agar dapat tumbuh sehat dan belajar dengan maksimal. Program ini dirancang untuk memastikan tidak ada siswa yang belajar dalam kondisi lapar. Dengan bekerja sama dengan sekolah, petani lokal, dan komunitas, kami menyediakan makanan yang seimbang dan bernutrisi bagi mereka yang membutuhkan.
              </motion.p>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`relative aspect-video rounded-xl overflow-hidden ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
              onClick={handleVideoClick}
            >
              <video
                ref={videoRef}
                onEnded={handleVideoEnd}
                className="w-full h-full object-cover"
                poster="/thumbnail.jpg"
              >
                <source
                  src="/video.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {/* Animated Play/Pause Overlay */}
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/30 flex items-center justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-white/90 p-4 rounded-full shadow-lg backdrop-blur-sm"
                  >
                    <PlayIcon className="w-12 h-12 text-blue-600" />
                  </motion.div>
                </motion.div>
              )}

              {/* Progress Bar Animation */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-blue-500"
                animate={{ width: isPlaying ? '100%' : '0%' }}
                transition={{ duration: videoRef.current?.duration || 0 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>
    
  

      {/* Misi & Visi Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
      >
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ x: -50 }}
            whileInView={{ x: 0 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
          >
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Misi Kami
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Memastikan Setiap Anak Mendapatkan Makanan Bergizi di Sekolah. Kami berkomitmen untuk menyediakan makanan gratis bagi anak-anak sekolah agar mereka dapat tumbuh sehat, belajar dengan baik, dan mencapai masa depan yang lebih cerah.
            </p>
          </motion.div>

          <motion.div 
            initial={{ x: 50 }}
            whileInView={{ x: 0 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
          >
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Visi Kami
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Mewujudkan Akses Makanan Bergizi untuk Semua Anak di Indonesia. Kami bertekad menciptakan lingkungan di mana setiap anak, tanpa memandang latar belakang, memiliki akses berkala makanan sehat yang mendukung pertumbuhan optimal.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Perjalanan Kami Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Perjalanan Kami
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Bagaimana Kami Menyediakan Jutaan Makanan Gratis
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Dengan dukungan dari donatur, relawan, dan kemitraan strategis, program ini telah membantu ribuan sekolah dan menjangkau anak-anak di seluruh Indonesia.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { value: '34M+', label: 'Makanan' },
                  { value: '400+', label: 'Sekolah' },
                  { value: '20+', label: 'Provinsi' }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-blue-50'}`}
                  >
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-96 bg-gray-200 rounded-xl overflow-hidden"
            >
              <img 
                src="/journey-image.jpg" 
                alt="Perjalanan Kami" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-16 bg-blue-600 text-white"
      >
        <div className="absolute inset-0 bg-[url('/texture.png')] opacity-90"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-bold mb-8">Jadilah Bagian dari Gerakan Peduli Anak!</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/registration"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                Gabung sebagai Relawan
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <button className="bg-transparent border border-white px-8 py-3 rounded-full hover:bg-white hover:text-blue-600 transition-colors">
                Ajak Teman
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Jadwal Kegiatan */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold mb-12 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Jadwal Kegiatan
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                date: '13 APR',
                title: 'Makan Siang Bersama',
                subtitle: 'Peduli & Berbagi',
                description: 'Acara makan siang bersama dengan siswa dan relawan'
              },
              {
                date: '25 APR',
                title: 'Seminar: Pentingnya Gizi',
                subtitle: 'Seimbang untuk Anak',
                description: 'Diskusi tentang pola makan sehat untuk anak-anak'
              }
            ].map((event, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex gap-6">
                  <div className={`text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    <div className="text-2xl font-bold">{event.date}</div>
                    <div className="text-sm">NEXT EVENTS</div>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {event.title}
                      <span className="block text-blue-600">{event.subtitle}</span>
                    </h3>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

const MediaPage = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    {
      name: "Sebastian",
      role: "Graphic Design",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      rating: 4,
      image: "/profile-1.jpg"
    },
    {
      name: "Evangeline",
      role: "Model",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      rating: 5,
      image: "/profile-2.jpg"
    },
    {
      name: "Alexander",
      role: "Software Engineer",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
      rating: 5,
      image: "/profile-3.jpg"
    }
    // Can add more if needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className={`w-auto mx-auto px-20 py-14 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Top News Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Top News
            </h2>
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Misi Kami untuk Anak-Anak
            </h2>
          </motion.div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Setiap anak berhak mendapatkan masa depan yang cerah. Melalui berbagai program dan kegiatan, 
              kami berusaha memberikan lingkungan yang mendukung pertumbuhan, pembelajaran, dan kebahagiaan mereka.
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                date: "15th Nov 2022",
                title: "Hari Peduli Gizi Anak",
                content: "Kegiatan edukasi tentang pentingnya gizi seimbang bagi anak-anak. Acara ini mencakup pembagian makanan sehat serta sesi informal untuk orang tua dan guru."
              },
              {
                date: "15th Nov 2022",
                title: "Bantuan Makanan untuk Sekolah Terpencil",
                content: "Menjangkau sekolah-sekolah di daerah terpencil, memastikan anak-anak mendapatkan asupan nutrisi yang cukup untuk mendukung pertumbuhan mereka."
              }
            ].map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: isDarkMode 
                    ? '0 10px 15px -3px rgba(255,255,255,0.1)' 
                    : '0 10px 15px -3px rgba(0,0,0,0.1)'
                }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
              >
              <div key={index} className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{news.date}</p>
                <h3 className={`text-xl font-semibold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {news.title}
                </h3>
                <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{news.content}</p>
              </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoni Carousel */}
      <section className="my-16">
        <h2 className={`text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Testimoni
        </h2>
        
        <div className="relative overflow-hidden">
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center p-8"
            >
              <img 
                src={testimonials[activeTestimonial].image}
                alt={testimonials[activeTestimonial].name}
                className="w-24 h-24 rounded-full object-cover mb-6"
              />
              <div className="flex mb-4">
                {renderStars(testimonials[activeTestimonial].rating)}
              </div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {testimonials[activeTestimonial].name}
              </h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {testimonials[activeTestimonial].role}
              </p>
              <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {testimonials[activeTestimonial].text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 mb-1 rounded-full ${
                  index === activeTestimonial 
                    ? 'bg-blue-600' 
                    : isDarkMode 
                      ? 'bg-gray-600' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ContactPage = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Wajib diisi'),
      lastName: Yup.string().required('Wajib diisi'),
      email: Yup.string().email('Email tidak valid').required('Wajib diisi'),
      subject: Yup.string().required('Wajib diisi'),
      message: Yup.string().required('Wajib diisi')
    }),
    onSubmit: (values, { resetForm }) => {
      // Placeholder submission logic
      alert('Formulir valid! (Data tidak benar-benar dikirim)');
      resetForm();
    }
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative py-16 bg-blue-600 text-white"
      >
        <div className="absolute inset-0 bg-[url('/texture.png')] opacity-90"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-bold mb-8">Jadilah Bagian dari Gerakan Peduli Anak!</h2>
          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <Link 
              to="/registration"
              className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Gabung sebagai Relawan
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Content */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div className={`space-y-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Informasi Kontak
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Telepon</h3>
                <p>+62 812 3456 7890</p>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>kontak@makariy.org</p>
              </div>
              <div>
                <h3 className="font-semibold">Kantor Pusat</h3>
                <p>Jl. Sudirman No. 123, Jakarta Selatan</p>
              </div>
              <div>
                <h3 className="font-semibold">Kantor Cabang</h3>
                <p>Jl. Gatot Subroto No. 456, Bandung</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 flex gap-4">
              {['facebook', 'instagram', 'twitter', 'linkedin'].map((platform) => (
                <a 
                  key={platform}
                  href={`#${platform}`}
                  className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
                >
                  <img 
                    src={`/${platform}-icon.svg`} 
                    alt={platform} 
                    className="w-6 h-6"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Nama Depan
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                    className={`w-full p-3 border rounded-lg ${
                      isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white text-black'
                    }`}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
                  )}
                </div>
                <div>
                  <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Nama Belakang
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                    className={`w-full p-3 border rounded-lg ${
                      isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white text-black'
                    }`}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
                  )}
                </div>
              </div>

              <div>
                <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className={`w-full p-3 border rounded-lg ${
                    isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white text-black'
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>

              <div>
                <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Subjek
                </label>
                <input
                  name="subject"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.subject}
                  className={`w-full p-3 border rounded-lg ${
                    isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white text-black'
                  }`}
                />
                {formik.touched.subject && formik.errors.subject && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.subject}</div>
                )}
              </div>

              <div>
                <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Pesan
                </label>
                <textarea
                  name="message"
                  rows="4"
                  onChange={formik.handleChange}
                  value={formik.values.message}
                  className={`w-full p-3 border rounded-lg ${
                    isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white text-black'
                  }`}
                ></textarea>
                {formik.touched.message && formik.errors.message && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.message}</div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                KIRIM
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Image Section */}
      <div className="h-96 bg-gray-200">
        <img 
          src="/map-placeholder.jpg" 
          alt="Peta Lokasi"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

const programs = [
  {
    title: 'Makan Siang Gratis',
    description: 'Penyediaan makanan bergizi untuk siswa setiap hari sekolah'
  },
  {
    title: 'Edukasi Gizi',
    description: 'Program pendidikan tentang pentingnya gizi seimbang'
  },
  {
    title: 'Program Relawan',
    description: 'Bergabung menjadi bagian dari gerakan kami'
  }
];

const ProfileDropdown = () => {
  const { user } = useContext(DarkModeContext);
  
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          useContext(DarkModeContext).isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
        }`}>
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-48 z-50 bg-white rounded-md shadow-lg py-1">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => signOut(auth)}
              className={`${active ? 'bg-gray-100' : ''} w-full px-4 py-2 text-left text-gray-700`}
            >
              Keluar
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

const ChatInterface = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hf = new HfInference(import.meta.env.VITE_HF_API_TOKEN);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    setMessages(prev => [...prev, { text: newMessage, isBot: false }]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await hf.textGeneration({
        model: "facebook/blenderbot-400M-distill",
        inputs: `User: ${newMessage}\nBot:`,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.9,
          repetition_penalty: 1.2
        },
        options: {
          use_cache: true,
          wait_for_model: true
        }
      });

      const botReply = response.generated_text 
        ? response.generated_text.replace('Bot:', '').trim()
        : "Maaf, saya tidak mengerti pertanyaan itu";
        
      setMessages(prev => [...prev, { text: botReply, isBot: true }]);
      
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { 
        text: "Silakan coba lagi dalam beberapa detik", 
        isBot: true 
      }]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const chatWindow = document.getElementById('chat-messages');
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        {isChatOpen ? '×' : '💬'}
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-xl w-80 mt-4`}
          >
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Layanan Pelanggan
              </h3>
            </div>
            
            <div id="chat-messages" className="h-64 p-4 overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className={`mb-4 ${msg.isBot ? 'text-left' : 'text-right'}`}>
                  <div className={`inline-block p-2 rounded-lg max-w-[80%] ${
                    msg.isBot 
                      ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900')
                      : 'bg-blue-600 text-white'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="text-left">
                  <div className="inline-block p-2 rounded-lg bg-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ketik pesan..."
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Kirim
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AuthForm = ({ isLogin }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } else {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
    setSubmitting(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-6xl mx-4 ${!isLogin ? 'md:grid md:grid-cols-2' : ''} gap-0 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
      } rounded-2xl shadow-xl overflow-hidden`}>
        
        {/* Image Column - Only for Registration */}
        {!isLogin && (
          <div className="hidden md:block">
            <img 
              src="/auth-illustration.png" 
              alt="Registration" 
              className="w-full h-full object-cover rounded-l-2xl"
            />
          </div>
        )}

        {/* Form Column */}
        <div className="p-12">
          <h2 className={`text-3xl font-bold mb-8 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {isLogin ? 'Masuk ke Akun Anda' : 'Create an Account'}
          </h2>
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={Yup.object({
              email: Yup.string().email('Email tidak valid').required('Wajib diisi'),
              password: Yup.string()
                .min(8, 'Minimal 8 karakter')
                .required('Wajib diisi')
            })}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors }) => (
              <Form className="space-y-6">
                {errors.general && (
                  <div className="text-red-500 text-center mb-4">{errors.general}</div>
                )}

                <div>
                  <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="makariy@gmail.com"
                    className={`w-full p-4 border rounded-lg focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                        : 'focus:ring-blue-500'
                    }`}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className={`w-full p-4 border rounded-lg focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                        : 'focus:ring-blue-500'
                    }`}
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isLogin ? 'Masuk' : 'Create Account'}
                </button>

                {isLogin ? (
                  <p className="mt-6 text-center text-gray-600">
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline font-semibold">
                      Daftar di sini
                    </Link>
                  </p>
                ) : (
                  <>
                    <div className="mt-8">
                      <button 
                        type="button"
                        className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
                        Continue with Google
                      </button>
                    </div>
                    <p className="mt-6 text-center text-gray-600">
                      Already Have An Account?{' '}
                      <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                        Log in
                      </Link>
                    </p>
                  </>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

// ================== Main App ==================
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <DarkModeContext.Provider value={{
      isDarkMode,
      toggleDarkMode: () => setIsDarkMode(!isDarkMode),
      user
    }}>
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
        <Router>
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/media" element={<MediaPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/registration" element={<RegistrationPage />} />
              <Route path="/login" element={<AuthForm isLogin={true} />} />
              <Route path="/register" element={<AuthForm isLogin={false} />} />
            </Routes>
          </main>

          <Footer />
          <ChatInterface />
        </Router>
      </div>
    </DarkModeContext.Provider>
  );
}