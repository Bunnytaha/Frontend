import React from 'react';
import bannerImg from "../../assets/banner.png";

const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12 bg-gray-100 rounded-xl'>
      {/* Right Side - Image */}
      <div className='md:w-1/2 w-full flex items-center md:justify-end'>
        <img
          src={bannerImg}
          alt="New Releases"
          className="w-full h-auto transition-transform transform hover:scale-105"
        />
      </div>

      {/* Left Side - Text Content */}
      <div className='md:w-1/2 w-full text-center md:text-left mx-6'>
        <h1 className='md:text-5xl text-3xl font-semibold text-gray-800 mb-7'>
          New Releases This Week
        </h1>
        <p className='mb-10 text-lg text-gray-600'>
          It's time to update your reading list with some of the latest and greatest releases in the literary world. From heart-pumping thrillers to captivating memoirs, this week's new releases offer something for everyone.
        </p>

        <button className='bg-primary text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-all duration-300'>
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Banner;
