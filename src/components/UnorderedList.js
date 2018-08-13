import React from 'react';

/* takes an array prop 'items' and returns a <ul> element 
   with each item as <li> elements */
const UnorderedList = ({ items }) => <ul className='grid'>
  {items.map((item, i) => <li className='col' key={i} dangerouslySetInnerHTML={{__html: item}}></li>)}
</ul>

export default UnorderedList;