import React from 'react';

import Collection from '../../Collection/Collection';
import Story from '../../Story/Story';
import Banner from '../../Banner/Banner';
import VideoBanner from '../../VideoBanner/VideoBanner';


const Home = () => {
    return (
        <div>
            <VideoBanner />
            <Banner />
            <Collection />
            <Story />
        </div>
    );
};

export default Home;