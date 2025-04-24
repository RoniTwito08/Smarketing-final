"use client";

import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import Logo from "../../../../components/UI/Logo";

export default function FooterComp() {
  return (
    <Footer container className="rtl" style={styles.rtl as React.CSSProperties}>
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="צור קשר" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">צ'אט</Footer.Link>
                <Footer.Link href="#">השאר פנייה</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="אודות" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">קרא עלינו</Footer.Link>
                <Footer.Link href="#">הצוות שלנו</Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="משפטי" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">מדיניות פרטיות</Footer.Link>
                <Footer.Link href="#">תנאים והגבלות</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>

          <Logo size="200px" />
        </div>

        <Footer.Divider />

        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Smarketing™"
            year={2024}
            className="flex flex-row-reverse items-center gap-2"
          />
          {/* <div className="mt-4 flex flex-row-reverse space-x-reverse space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
          </div> */}
        </div>
      </div>
    </Footer>
  );
}

const styles = {
  rtl: {
    maxWidth: "90%",
    marginBottom: "30px",
    direction: "rtl",
    textAlign: "right",
  },
};
