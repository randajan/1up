import React from 'react';
import { Block } from "@randajan/jet-react/dom/block";

import "./QrLoadPage.scss";
import { qrStylesBeam } from '../../../config/bifrost';
import { useBeam } from '@randajan/bifrost/client/react';

export const QrLoadPage = (props)=>{
    const {} = props;
    const { data:qrStyles } = useBeam(qrStylesBeam);

    //'[{"id":"XEzKt0V6oydEZF42","name":"itcan", "desc":"more info", "style":"*STYLE DATA AS OBJECT*","isPublic":false,"viewers":["2447ac8e"],"editors":[],"owner":"pb5buf43","updatedAt":"2026-02-21T17:54:03.908Z","updatedBy":"pb5buf43","createdAt":"2026-02-20T21:24:54.363Z","lvl":1,"isEditable":true}]'
    console.log(qrStyles);

    
    return (
        <Block className="QrLoadPage" caption="QrLoadPage">
            
        </Block>
    )
}

