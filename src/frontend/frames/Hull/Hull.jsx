import React from 'react';
import { Router } from '../../pages';

import "./Hull.scss";

export const Hull = () => {
  return (
    <Router className="Hull" transition={500} transitionPrefix="page"/>
  )
}

export default Hull;
