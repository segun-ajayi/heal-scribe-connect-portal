import DOMPurify from 'dompurify';

type SafeHtmlProps = {
    html: string;
    className?: string;
};

const SafeHtml = ({ html, className = '' }: SafeHtmlProps) => {
    const sanitized = DOMPurify.sanitize(html);

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitized }}
        />
    );
};

export default SafeHtml;