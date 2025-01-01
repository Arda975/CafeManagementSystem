import React from 'react';
import { Link } from 'react-router-dom'; // Ana sayfaya yönlendirme için Link bileşeni
import './About.css';

function About() {
    return (
        <div className="about-page">
            {/* Ana Sayfa Dönüş Butonu */}
            <div className="back-home">
                <Link to="/" className="home-button">Ana Sayfa</Link>
            </div>

            <div className="about-header">
                <h1>Amedim Cafe Hakkında</h1>
                <p>Lezzetli yemeklerimiz ve sıcak atmosferimizle sizleri bekliyoruz.</p>
            </div>

            <div className="about-content">
                <div className="about-info">
                    <h2>Kafe Adresi</h2>
                    <p>
                        <a
                            href="https://maps.app.goo.gl/iuQqfmuDTcjcVxSU7"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Amedim Cafe, İstanbul, Türkiye
                        </a>
                        <br />
                        İstanbul'un en güzel köşesinde yer alan Amedim Cafe, şehrin gürültüsünden uzaklaşmak isteyenlere huzurlu bir kaçış sunuyor.
                    </p>
                </div>

                <div className="about-info">
                    <h2>Sosyal Medya</h2>
                    <p>
                        <a
                            href="https://www.instagram.com/arda.aydin.official/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram Hesabımıza Git
                        </a>
                        <br />
                        Bizi Instagram'da takip ederek, yeni menü ürünlerimizden ve etkinliklerimizden haberdar olabilirsiniz.
                    </p>
                </div>

                <div className="about-info">
                    <h2>Telefon Numarası</h2>
                    <p>
                        <a href="tel:+902123456789">+90 212 345 67 89</a>
                        <br />
                        Haftanın 7 günü, sabah 9'dan gece 11'e kadar bizlere ulaşabilirsiniz.
                    </p>
                </div>
            </div>

            <div className="about-history">
                <h2>Kafemizin Tarihçesi</h2>
                <p>
                    Amedim Cafe, 2010 yılında İstanbul'da kuruldu. Başlangıçta küçük bir kafe olarak açılan işletmemiz, kısa süre içerisinde şehrin en sevilen mekanlarından biri haline geldi. Müşteri memnuniyeti odaklı hizmet anlayışımız sayesinde, her geçen yıl daha fazla misafir ağırlıyoruz.
                </p>
            </div>

            <div className="about-branches">
                <h2>Şubelerimiz</h2>
                <div className="branches-list">
                    <div className="branch-item">
                        <h3>İstanbul - Beyoğlu</h3>
                    </div>
                    <div className="branch-item">
                        <h3>İstanbul - Kadıköy</h3>
                    </div>
                    <div className="branch-item">
                        <h3>İzmir - Alsancak</h3>
                    </div>
                    <div className="branch-item">
                        <h3>Ankara - Çankaya</h3>
                    </div>
                </div>
                <p>
                    Amedim Cafe'nin dört şubesiyle Türkiye genelinde hizmet veriyoruz. Her bir şubemiz, misafirlerine aynı kaliteli hizmeti sunmaktadır.
                </p>
            </div>
        </div>
    );
}

export default About;