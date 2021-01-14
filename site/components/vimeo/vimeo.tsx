export default function Vimeo({ id }: { id: string }) {
  return (
    <iframe
      src={`https://player.vimeo.com/video/${id}`}
      width="100%"
      height="500px"
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}
