import ResponsiveEmbed from 'react-responsive-embed';

export default function Vimeo({ id }: { id: string }) {
  return (
    <ResponsiveEmbed
      src={`https://player.vimeo.com/video/${id}`}
      width="100%"
      height="100%"
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}
