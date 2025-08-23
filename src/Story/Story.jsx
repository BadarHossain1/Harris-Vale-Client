import React from 'react';

const Story = () => {
    return (
        <div  className="w-full bg-black text-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <h2
                            className="text-4xl md:text-5xl font-bold mb-8"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Our Story
                        </h2>

                        <div
                            className="space-y-6"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            <p className="text-base md:text-lg leading-relaxed">
                                Founded on the principles of exceptional craftsmanship and
                                timeless design, Harris Vale represents the pinnacle of modern
                                menswear. Our journey began with a simple vision: to create
                                clothing that embodies sophistication while embracing
                                contemporary style.
                            </p>

                            <p className="text-base md:text-lg leading-relaxed">
                                Every piece in our collection is meticulously crafted using the finest
                                materials and traditional techniques, ensuring not just style, but longevity.
                                We believe that true elegance lies in the details, and our commitment to
                                excellence is evident in every stitch.
                            </p>

                            <p className="text-base md:text-lg leading-relaxed">
                                Harris Vale is more than a brand – it's a statement of individuality,
                                confidence, and refined taste. Join us in redefining what it means to dress
                                well.
                            </p>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="order-1 lg:order-2">
                        <div className="rounded-lg overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1536243298747-ea8874136d64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Abstract portrait representing Harris Vale's artistic approach to fashion"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Story;