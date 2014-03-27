var expect = require('expect.js');
import { List } from '../List';

describe('List', () => {

    it('should create a new empty list', () => {
        var list = new List;
        expect(list.isEmpty()).to.be(true);
        expect(list).to.have.length(0);
    });

    describe('add()', () => {
        it('should allow to add new simple elements', () => {
            var list = new List;
            list.add(1);
            list.add(2);
            list.add(3);
            expect(list.isEmpty()).to.be(false);
            expect(list).to.have.length(3);
        });

        it('should allow to add elements from an array', () => {
            var list = new List;
            list.add([1, 2, 3, 4]);
            list.add([5, 6]);
            list.add([7]);
            list.add(8);
            expect(list.isEmpty()).to.be(false);
            expect(list).to.have.length(8);
        });

        it('should allow to add a list inside another list', () => {
            var list = new List;
            var list2 = new List;
            list.add([1, 2, 3]);
            list2.add([4, 5, 6]);
            expect(list).to.have.length(3);
            expect(list2).to.have.length(3);
            list.add(list2);
            expect(list).to.have.length(6);
            expect(list2).to.have.length(3);
            expect(list.first()).to.be(1);
            expect(list.last()).to.be(6);
        });
    });

    describe('get()', () => {
        it('should get elements by position', () => {
            var list = new List;
            list.add([1, 2, 3]);
            expect(list.get(0)).to.be(1);
            expect(list.get(1)).to.be(2);
            expect(list.get(2)).to.be(3);
            expect(list[0]).to.be(1);
            expect(list[1]).to.be(2);
            expect(list[2]).to.be(3);
        });
    });

    describe('first(), last() and initial()', () => {
        it('should get first, last and initial elements', () => {
            var list = new List;
            list.add([1, 2, 3]);
            expect(list.first()).to.be(1);
            expect(list.last()).to.be(3);
            expect(list.initial()).to.be.a(List);
            expect(list.initial().first()).to.be(1);
            expect(list.initial().last()).to.be(2);
            expect(list.initial(2).last()).to.be(1);
        });
    });

    describe('contains()', () => {
        it('should check if a list contains an element', () => {
            var list = new List;
            list.add([1, 2, 2, 3]);
            expect(list.contains(1)).to.be(true);
            expect(list.contains(2)).to.be(true);
            expect(list.contains(3)).to.be(true);
            expect(list.contains(4)).to.be(false);
            expect(list.contains('1')).to.be(false);
            expect(list.contains(true)).to.be(false);
            expect(list.contains([])).to.be(false);
        });
    });

    describe('indexOf()', () => {
        it('should returns the index of the first occurrence of an element', () => {
            var list = new List;
            list.add([1, 2, 2, 3]);
            expect(list.indexOf(1)).to.be(0);
            expect(list.indexOf(2)).to.be(1);
            expect(list.indexOf(3)).to.be(3);
            expect(list.indexOf(5)).to.be(-1);
        });
    });

    describe('lastIndexOf()', () => {
        it('should returns the index of the last occurrence of an element', () => {
            var list = new List;
            list.add([1, 2, 2, 3]);
            expect(list.lastIndexOf(1)).to.be(0);
            expect(list.lastIndexOf(2)).to.be(2);
            expect(list.lastIndexOf(3)).to.be(3);
            expect(list.lastIndexOf(5)).to.be(-1);
        });
    });

    describe('equals()', () => {
        it('should check if two lists are equals', () => {
            var list = new List;
            var list2 = new List;
            list.add([1, 2, 3]);
            list2.add([1, 2, 3]);
            expect(list.equals(list2)).to.be(true);
            list2.replaceAll([1, 1, 1]);
            expect(list2.equals(list)).to.be(false);
        });

        it('should check if a list is equal to an array', () => {
            var list = new List;
            list.add([1, 2, 3]);
            expect(list.equals([1, 2, 3])).to.be(true);
            expect(list.equals([1, 1, 1])).to.be(false);
        });
    });

    describe('clear()', () => {
        it('should remove all the elements from the list', () => {
            var list = new List;
            list.add([1, 2, 3]);
            expect(list.isEmpty()).to.be(false);
            expect(list).to.have.length(3);
            list.clear();
            expect(list.isEmpty()).to.be(true);
            expect(list).to.have.length(0);
        });
    });

    describe('remove(), removeElement() and removeAll()', () => {
        it('should remove an element at the specified position in the list', () => {
            var list = new List;
            list.add([1, 2, 3, 4, 5]);
            list.remove(0); // remove 1
            list.remove(2); // remove 4
            list.remove(99); // there is not an element in this position
            expect(list).to.have.length(3);
            expect(list.first()).to.be(2);
            expect(list.last()).to.be(5);
            expect(list.contains(1)).to.be(false);
            expect(list.contains(2)).to.be(true);
            expect(list.contains(3)).to.be(true);
            expect(list.contains(4)).to.be(false);
            expect(list.contains(5)).to.be(true);
        });

        it('should remove the first occurrence of an specified element', () => {
            var list = new List;
            list.add([1, 2, 3, 4, 5]);
            list.removeElement(1);
            list.removeElement(4);
            list.removeElement(99);
            expect(list).to.have.length(3);
            expect(list.first()).to.be(2);
            expect(list.last()).to.be(5);
            expect(list.contains(1)).to.be(false);
            expect(list.contains(2)).to.be(true);
            expect(list.contains(3)).to.be(true);
            expect(list.contains(4)).to.be(false);
            expect(list.contains(5)).to.be(true);
        });

        it('should remove all the elements of another list', () => {
            var list = new List;
            var list2 = new List;
            list.add([1, 2, 3, 4, 5]);
            list2.add([1, 4]);
            list.removeAll(list2);
            expect(list).to.have.length(3);
            expect(list.first()).to.be(2);
            expect(list.last()).to.be(5);
            expect(list.contains(1)).to.be(false);
            expect(list.contains(2)).to.be(true);
            expect(list.contains(3)).to.be(true);
            expect(list.contains(4)).to.be(false);
            expect(list.contains(5)).to.be(true);
        });
    });

    describe('toArray()', () => {
        it('should return an array with all the elements of the list', () => {
            var list = new List;
            list.add([1, 2, 3]);
            list.add([4, 5, 6]);
            expect(list.equals([1, 2, 3, 4, 5, 6])).to.be(true);
        });
    });

    describe('each() and forEach()', () => {
        it('should call a function for each element', () => {
            var list = new List;
            var count = 0;
            list.add([1, 2, 3, 4, 5, 6]);
            list.each(() => count++);
            expect(count).to.be(6);
            count = 0;
            list.forEach(() => count++);
            expect(count).to.be(6);
        });
    });

    describe('clone()', () => {
        it('should create a new list equal to the cloned one', () => {
            var list = new List;
            var list2;
            list.add([1, 2, 3, 4, 5, 6]);
            list2 = list.clone();
            expect(list.equals(list2)).to.be(true);
            list2.removeAll([1, 2, 3]);
            expect(list).to.have.length(6);
            expect(list2).to.have.length(3);
        });
    });

    describe('rest()', () => {
        it('should return the rest of the list', () => {
            var list = new List;
            list.add([1, 2, 3, 4]);
            expect(list.rest()).to.be.a(List);
            expect(list.rest().equals([2, 3, 4])).to.be(true);
        });
    });

    describe('compact()', () => {
        it('should return a new list compacted', () => {
            var list = new List;
            list.add([1, 0, 2, false, 3, '']);
            expect(list.compact()).to.be.a(List);
            expect(list.compact().equals([1, 2, 3])).to.be(true);
        });
    });

    describe('flatten()', () => {
        it('should return a new list flatten', () => {
            var list = new List;
            list.add([[1, [2], [[3, [4, 5, [[6]]]]]]]);
            expect(list.flatten()).to.be.a(List);
            expect(list.flatten().equals([1, 2, 3, 4, 5, 6])).to.be(true);
        });
    });

    describe('without()', () => {
        it('should return a list without the specified values', () => {
            var list = new List;
            list.add([1, 2, 3, 4, 5, 6]);
            expect(list.without(1)).to.be.a(List);
            expect(list.without(1, 3, 5).equals([2, 4, 6])).to.be(true);
            expect(list.without(1, 2, 3, 4, 5, 6).isEmpty()).to.be(true);
            expect(list.without(99).equals(list)).to.be(true);
        });
    });

    describe('find() and findOne()', () => {
        it('should fine one element that match the query', () => {
            var list = new List;
            list.add([1, 2, 3, 4, 5, 6]);
            var even = list.findOne(num => num % 2 === 0);
            expect(even).to.be(2);
        });

        it('should find all the elements that match the query', () => {
            var list = new List;
            list.add([1, 2, 3, 4, 5, 6]);
            var evens = list.find(num => num % 2 === 0);
            expect(evens).to.be.a(List);
            expect(evens.equals([2, 4, 6])).to.be(true);
        });
    });
});