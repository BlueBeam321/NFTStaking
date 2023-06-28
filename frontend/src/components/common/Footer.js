import Disclaimer from '../home/Disclaimer';
import TermsOfUse from '../home/TermsOfUse';
import TermsConditions from '../home/TermsConditions';
import { useState } from 'react';

export const Footer = () => {
    const [showModalDisclaimer, setShowModalDisclaimer] = useState();
    const [showModalTermsOfUse, setShowModalTermsOfUse] = useState();
    const [showModalTermsConditions, setShowModalTermsConditions] = useState();
    return (
        <footer>
            <div className="left">
                <a href="https://twitter.com/robromides"><i className="fa-brands fa-twitter"></i></a>
                <a href="https://instagram.com/robromidesproject"><i className="fa-brands fa-instagram"></i></a>
            </div>
            <div className="center">
                {/* <a href="#" onClick={() => setShowModalDisclaimer(!showModalDisclaimer)}><span>Risk Disclaimer</span></a> */}
                {/* <a href="/docs/Terms of use.pdf" target="_blank"><span>Terms of Use</span></a>
                <a href="/docs/TermsConditions.pdf" target="_blank"><span>Terms & Conditions</span></a>
                <a href="/docs/Privacy.pdf" target="_blank"><span>Privacy & Cookies</span></a> */}
                {/* <a href="#" onClick={() => setShowModalTermsOfUse(!showModalTermsOfUse)}><span>Terms of Use</span></a>
                <a href="#" onClick={() => setShowModalTermsConditions(!showModalTermsConditions)}><span>Terms & Conditions</span></a>
                <a href="#"><span>Privacy & Cookies</span></a> */}
            </div>

            {showModalDisclaimer && (
        <Disclaimer
          handleClose={() => setShowModalDisclaimer(!showModalDisclaimer)}
        />
      )}
      {showModalTermsOfUse && (
        <TermsOfUse
          handleClose={() => setShowModalTermsOfUse(!showModalTermsOfUse)}
        />
      )}
        {showModalTermsConditions && (
        <TermsConditions
          handleClose={() => setShowModalTermsConditions(!showModalTermsConditions)}
        />
      )}
            
            {/* <img className="popsicle threePop" src="/img/threePop.png" alt="#" /> */}
            {/* <img className="popsicle onePop" src="/img/onePop.png" alt="#" /> */}
            <img className="popsicle twoPop" src="/img/one.png" alt="#" />
            <img className="popsicle fourPop" src="/img/one.png" alt="#" style={{zIndex: "0 !important"}}/>
               
        </footer>
    );
}

export default Footer;