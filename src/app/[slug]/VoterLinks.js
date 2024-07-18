import Image from 'next/image'
import styles from './VoterLinks.module.css';

const linkData = [
    { title: 'Check your Registration', icon:'/icon-checkRegistration.svg', linkTo: '' },
    { title: 'Paper Registration (English)', icon:'/icon-paperRegistration.svg', linkTo: '' },
    { title: 'PAPER Registration (Español)', icon:'/icon-paperRegistration.svg', linkTo: '' },
    { title: 'Online Registration', icon:'/icon-onlineRegistration.svg', linkTo: ''}
];
function VoterLinks({ headline }) {
    return (
        <div className={styles.container}>
            <h2>{headline}</h2>
            <div className={styles.linkContainer}>
                {linkData.map((link, index) => (
                    <a className={styles.link} key={index} href={link.linkTo}>
                        <Image 
                            className={styles.icon}
                            width={100}
                            height={100}
                            src={link.icon} alt="icon" />
                        {link.title}
                    </a>
                ))}
            </div>
        </div>
    )
}
export default VoterLinks;