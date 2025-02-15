import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css"

const Landingpage = () => {
    return (
        <> 

            <div className="landingcontainer">
                <div className='hero'>
                    <h1>Welcome to StaySphere</h1>
                    <p>Find your perfect stay at the best prices</p>
                    <Link to={'/homescreen'}><button className='landingbtn'>Let's Started</button></Link>
                </div>

                <div className='about' id='about'>
                    <h2>About Us</h2>
                    <div className='aboutinfo'>
                        <p>StaySphere is a platform that connects travelers with the best accommodations at the best prices. Our mission is to simplify the travel experience by
                            offering an intuitive and reliable platform for discovering, comparing, and booking hotels, resorts, and vacation rentals worldwide. Whether
                            you're planning a business trip, a family vacation, or a weekend getaway, StaySphere helps you find the best options that fit your needs and budget.
                            We are committed to offering excellent customer service and providing you with the best deals on your travels. Our platform is constantly evolving,
                            ensuring we stay up-to-date with the latest trends in the hospitality industry to give you the most convenient and rewarding booking experience.</p>
                        <img src="https://images.trvl-media.com/lodging/2000000/1700000/1695500/1695484/61d41195.jpg?impolicy=fcrop&w=1200&h=800&p=1&q=medium" alt="" />
                    </div>
                </div>

                <section class="services" id='services'>
                    <div class="servicecontainer">
                        <h2 class="section-title">Our Services</h2>
                        <div class="service-list">
                            <div class="service-item">
                                <h3>Hotel & Accommodation Booking</h3>
                                <p>Browse and book from a wide range of hotels, resorts, and vacation rentals, with filters to help you find the perfect match based on price, location, and amenities.</p>
                            </div>
                            <div class="service-item">
                                <h3>Real-Time Availability</h3>
                                <p>Check real-time room availability to ensure your booking is confirmed instantly without any hassles.</p>
                            </div>
                            <div class="service-item">
                                <h3>Exclusive Deals & Discounts</h3>
                                <p>Get access to special offers, last-minute deals, and discounted rates on select properties, ensuring you save more on your stay.</p>
                            </div>
                            <div class="service-item">
                                <h3>Detailed Hotel Information</h3>
                                <p>View in-depth descriptions, photos, and guest reviews to help you make informed decisions about your stay.</p>
                            </div>
                            <div class="service-item">
                                <h3>Flexible Cancellation & Modifications</h3>
                                <p>Enjoy peace of mind with flexible cancellation policies and the ability to modify your booking directly through the app.</p>
                            </div>
                            <div class="service-item">
                                <h3>Loyalty Program</h3>
                                <p>Join our rewards program to earn points on every booking and enjoy exclusive perks like free nights, upgrades, and discounts on future bookings.</p>
                            </div>
                            <div class="service-item">
                                <h3>24/7 Customer Support</h3>
                                <p>Our dedicated support team is available 24/7 to assist with any questions, booking issues, or concerns you may have, ensuring you're never alone during your travels.</p>
                            </div>
                            <div class="service-item">
                                <h3>Payment Flexibility</h3>
                                <p>Pay securely using a variety of methods, including credit/debit cards, mobile wallets, and local payment options, for a smooth and secure transaction experience.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="contact" id='contact'>
                    <div class="contactcontainer">
                        <h2 class="section-title">Get in Touch</h2>
                        <p class="contact-description">We're here to assist you with any inquiries, bookings, or support needs. Reach out to us through the following options:</p>

                        <div class="contact-methods">
                            <div class="contact-item">
                                <div class="icon">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <h3>Email Support</h3>
                                <p>If you need any assistance, feel free to send us an email, and our team will get back to you promptly:</p>
                                <p><strong>Email:</strong> support@staysphere.com</p>
                            </div>

                            <div class="contact-item">
                                <div class="icon">
                                    <i class="fas fa-phone-alt"></i>
                                </div>
                                <h3>Call Us</h3>
                                <p>For urgent inquiries or immediate assistance, give us a call:</p>
                                <p><strong>Phone:</strong> +1-800-123-4567</p>
                            </div>

                            <div class="contact-item">
                                <div class="icon">
                                    <i class="fas fa-map-marker-alt"></i>
                                </div>
                                <h3>Our Office</h3>
                                <p>Feel free to visit us in person at our headquarters for any assistance or inquiries:</p>
                                <p>StaySphere, 123 Travel Lane, Suite 456, City, Country</p>
                            </div>

                            <div class="contact-item">
                                <div class="icon">
                                    <i class="fas fa-share-alt"></i>
                                </div>
                                <h3>Follow Us</h3>
                                <p>Stay updated with our latest offers and news on social media:</p>
                                <p><a href="https://facebook.com/staysphere" target="_blank">Facebook</a></p>
                                <p><a href="https://twitter.com/staysphere" target="_blank">Twitter</a></p>
                                <p><a href="https://instagram.com/staysphere" target="_blank">Instagram</a></p>
                            </div>
                        </div>
                    </div>
                </section>


            </div>
        </>
    )
}

export default Landingpage