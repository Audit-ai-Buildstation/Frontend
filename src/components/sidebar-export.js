import { Sidebar, SidebarBody, SidebarLink } from '../components/sidebar';
import { IconHome, IconBrain,IconAd2 } from '@tabler/icons-react'; 
import Logo from "../app/logo.png";	
import Image from 'next/image';

export default function Main() {
    return (
        <Sidebar>
            <SidebarBody>
                <SidebarLink
                    link={{ href: "/main", label: "Audit.ai", icon: <Image src={Logo} alt="Audit.ai Logo" width={24} height={24} /> }}
                />
                <SidebarLink
                    link={{ href: "/main", label: "Home", icon: <IconHome /> }}
                />
                <SidebarLink
                    link={{ href: "/contribute", label: "Contribute to the AI", icon: <IconBrain /> }}
                />
                <SidebarLink
                    link={{ href: "/vulnerabilities", label: "Learn more about vulnerabilities", icon: <IconAd2 /> }}
                />
            </SidebarBody>
        </Sidebar>
    );
}