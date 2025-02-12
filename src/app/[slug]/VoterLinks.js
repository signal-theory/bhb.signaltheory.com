import Image from 'next/image'
import styles from './VoterLinks.module.css';

function VoterLinks({ data }) {
    if (!data) {
        console.error('VoterLinks: data prop is undefined');
        return null;
    }
    
    const { headline, checkRegistration, paperRegistrationEN, paperRegistrationES, onlineRegistration } = data;
    const linkData = [
        { title: 'Check your Registration', icon:'/icon-checkRegistration.svg', linkTo: checkRegistration },
        { title: 'Paper Registration (English)', icon:'/icon-paperRegistration.svg', linkTo: paperRegistrationEN },
        { title: 'PAPER Registration (Español)', icon:'/icon-paperRegistration.svg', linkTo: paperRegistrationES },
        { title: 'Online Registration', icon:'/icon-onlineRegistration.svg', linkTo: onlineRegistration}
    ];
    return (
        <div className={styles.container} id="voter-links">
            <h2>{headline}</h2>
            <div className={styles.linkContainer}>
                {linkData.map((link, index) => (
                    link.linkTo && (
                        <a className={styles.link} key={index} href={link.linkTo.url} target='_blank'>
                            <Image 
                                className={styles.icon}
                                width={100}
                                height={100}
                                src={link.icon} alt="icon" />
                           <span dangerouslySetInnerHTML={{ __html: link.title}} />
                        </a>
                    )
                ))}
            </div>
        </div>
    )
}
export default VoterLinks;
