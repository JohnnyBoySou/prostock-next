 
export default function Tabs({ types, setValue, value }) {
  return (
    <div style={{ backgroundColor: '#fff', flexDirection: 'row',display: 'flex' }}>
      {types.map((type, index) => (
        <div onClick={() => {
          setValue(type);
        }} key={index}
          style={{
            justifyContent: 'center', alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: value === type ? '#019866' : '#01986610',
            cursor: 'pointer',
            borderRadius: 8,
            margin: '0px 12px 0px 0px',
          }}>
          <span style={{
            fontSize: 16,
            color: value === type ? '#fff' : '#019866',
            textTransform: 'uppercase',
          }}>{type}</span>
        </div>
      ))}
    </div>
  )

}