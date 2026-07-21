export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className = "section-header">
      <div>
        <h3 className = "section-header__title">{title}</h3>
        {subtitle && <div className = "section-header__sub">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}
