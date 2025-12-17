import { StyleSheet } from 'react-native';

export const homeStyle = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contatiner: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listContainer: {
    flex: 1,
    display: 'flex',
  },
  cardConatiner: {
    marginBottom: 60,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#dfdfdf',
  },
});
