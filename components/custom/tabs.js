 
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
            borderBottomWidth: 4, borderBottomColor: value === type ? '#019866' : 'transparent',
            cursor: 'pointer',
            borderRadius:'6px 6px 0px 0px',
            backgroundColor: value === type ? '#01986610':'#fff',
          }}>
          <span style={{
            fontSize: 16,
            color: value === type ? '#019866' : '#8C8C8C',
            textTransform: 'uppercase',
          }}>{type}</span>
        </div>
      ))}
    </div>
  )

}