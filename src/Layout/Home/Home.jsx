import React from 'react';

import Collection from '../../Collection/Collection';
import Story from '../../Story/Story';
import Banner from '../../Banner/Banner';


const Home = () => {
    return (
        <div>
            
            <Banner></Banner>
            <Collection></Collection>
            <Story></Story>
        </div>
    );
};

export default Home;