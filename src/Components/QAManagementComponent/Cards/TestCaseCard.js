import React from 'react';
import { Card, CardBody, CardFooter, Button, } from 'reactstrap';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

const TestCaseCard = (props) => {

    const customStyle = {
        backgroundColor: '#f2f2fc',
        borderRadius: '5px',
        border: "2px solid #4d44b5"

    }
    const buttonStyle = {
        backgroundColor: '#e2e1f5',
        border: '2px solid #4d44b5',
        color: '#4d44b5',
    };
    const createMarkup = (html) => {
        return { __html: DOMPurify.sanitize(html) };
      };
    return (
               <Card className="ribbon-box shadow-none mb-lg-2" style={{ ...customStyle, }}>
                    <CardBody >
                        <div className={`ribbon ${props.status== true ? ("ribbon-success") : props.status == false ? 'ribbon-danger' :'ribbon-secondary' }  ribbon-shape`}>{props.status== true ? 'Succcess': props.status == false ?'Fail': 'Pending' }</div><br /><br />
                        <div  style={{height:'25xpx', maxHeight:'25px',overflowY:'hidden'}}  ><h3 className="fs-18 text-end text-center mb-2"><strong>{props.title}</strong></h3><br /></div>
                        
                        <h5 className='fs-14 mt-5'>Scenario</h5>
                            <div style={{height:'68px', maxHeight:'68px',overflowY:'hidden'}} dangerouslySetInnerHTML={createMarkup(props.scenario)} />
                        <br></br>
                        <h5 className='fs-14 '>Description</h5>
                            <div style={{height:'68px', maxHeight:'68px',overflowY:'hidden'}} dangerouslySetInnerHTML={createMarkup(props.description)} />
                    </CardBody>
                    <CardFooter className='bg-transparent border-0'>
                        <Link to={`/project/module/testcase/${props.id}`}> <Button color="text-black btn w-100" style={{ ...buttonStyle, }}>TEST</Button></Link>
                    </CardFooter>
                </Card>
         

    )
}

export default TestCaseCard