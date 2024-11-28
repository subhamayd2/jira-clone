import Image from 'next/image';

const LogoTitle = () => (
    <div className="flex items-center gap-3">
        <Image src="/logo.svg" width={36} height={36} alt="logo" />
        <h1 className="text-2xl font-bold">JIRA clone</h1>
    </div>
);

export default LogoTitle;
