var expect = require('expect.js');

var rode = require('../../../../rode');

describe('rode.List', function () {

    it('should create a new empty list', function () {
        var list = new rode.List;
        expect(list.isEmpty()).to.be(true);
        expect(list).to.have.length(0);
    });

    describe('add()', function () {
        it('should allow to add new simple elements', function () {
            var list = new rode.List;
            list.add(1);
            list.add(2);
            list.add(3);
            expect(list.isEmpty()).to.be(false);
            expect(list).to.have.length(3);
        });

        it('should allow to add elements from an array', function () {
            var list = new rode.List;
            list.add([1, 2, 3, 4]);
            list.add([5, 6]);
            list.add([7]);
            list.add(8);
            expect(list.isEmpty()).to.be(false);
            expect(list).to.have.length(8);
        });

        it('should allow to add a list inside another list', function () {
            var list = new rode.List;
            var list2 = new rode.List;
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

    describe('get()', function () {
        it('should get elements by position', function () {
            var list = new rode.List;
            list.add([1, 2, 3]);
            expect(list.get(0)).to.be(1);
            expect(list.get(1)).to.be(2);
            expect(list.get(2)).to.be(3);
            expect(list[0]).to.be(1);
            expect(list[1]).to.be(2);
            expect(list[2]).to.be(3);
        });
    });

    describe('first(), last() and initial()', function () {
        it('should get first, last and initial elements', function () {
            var list = new rode.List;
            list.add([1, 2, 3]);
            expect(list.first()).to.be(1);
            expect(list.last()).to.be(3);
            expect(list.initial()).to.be.a(rode.List);
            expect(list.initial().first()).to.be(1);
            expect(list.initial().last()).to.be(2);
            expect(list.initial(2).last()).to.be(1);
        });
    });

    describe('contains()', function () {
        it('should check if a list contains an element', function () {
            var list = new rode.List;
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

    describe('indexOf()', function () {
        it('should returns the index of the first occurrence of an element', function () {
            var list = new rode.List;
            list.add([1, 2, 2, 3]);
            expect(list.indexOf(1)).to.be(0);
            expect(list.indexOf(2)).to.be(1);
            expect(list.indexOf(3)).to.be(3);
            expect(list.indexOf(5)).to.be(-1);
        });
    });

    describe('lastIndexOf()', function () {
        it('should returns the index of the last occurrence of an element', function () {
            var list = new rode.List;
            list.add([1, 2, 2, 3]);
            expect(list.lastIndexOf(1)).to.be(0);
            expect(list.lastIndexOf(2)).to.be(2);
            expect(list.lastIndexOf(3)).to.be(3);
            expect(list.lastIndexOf(5)).to.be(-1);
        });
    });

    describe('equals()', function () {
        it('should check if two lists are equals', function () {
            var list = new rode.List;
            var list2 = new rode.List;
            list.add([1, 2, 3]);
            list2.add([1, 2, 3]);
            expect(list.equals(list2)).to.be(true);
            list2.replaceAll([1, 1, 1]);
            expect(list2.equals(list)).to.be(false);
        });

        it('should check if a list is equal to an array', function () {
            var list = new rode.List;
            list.add([1, 2, 3]);
            expect(list.equals([1, 2, 3])).to.be(true);
            expect(list.equals([1, 1, 1])).to.be(false);
        });
    });

    describe('clear()', function () {
        it('should remove all the elements from the list', function () {
            var list = new rode.List;
            list.add([1, 2, 3]);
            expect(list.isEmpty()).to.be(false);
            expect(list).to.have.length(3);
            list.clear();
            expect(list.isEmpty()).to.be(true);
            expect(list).to.have.length(0);
        });
    });

    describe('remove(), removeElement() and removeAll()', function () {
        it('should remove an element at the specified position in the list', function () {
            var list = new rode.List;
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

        it('should remove the first occurrence of an specified element', function () {
            var list = new rode.List;
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

        it('should remove all the elements of another list', function () {
            var list = new rode.List;
            var list2 = new rode.List;
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

    describe('toArray()', function () {
        it('should return an array with all the elements of the list', function () {
            var list = new rode.List;
            list.add([1, 2, 3]);
            list.add([4, 5, 6]);
            expect(list.equals([1, 2, 3, 4, 5, 6])).to.be(true);
        });
    });

    describe('each() and forEach()', function () {
        it('should call a function for each element', function () {
            var list = new rode.List;
            var count = 0;
            list.add([1, 2, 3, 4, 5, 6]);
            list.each(function () {
                count++;
            });
            expect(count).to.be(6);
            count = 0;
            list.forEach(function () {
                count++;
            });
            expect(count).to.be(6);
        });
    });

    describe('clone()', function () {
        it('should create a new list equal to the cloned one', function () {
            var list = new rode.List;
            var list2;
            list.add([1, 2, 3, 4, 5, 6]);
            list2 = list.clone();
            expect(list.equals(list2)).to.be(true);
            list2.removeAll([1, 2, 3]);
            expect(list).to.have.length(6);
            expect(list2).to.have.length(3);
        });
    });

    describe('rest()', function () {
        it('should return the rest of the list', function () {
            var list = new rode.List;
            list.add([1, 2, 3, 4]);
            expect(list.rest()).to.be.a(rode.List);
            expect(list.rest().equals([2, 3, 4])).to.be(true);
        });
    });

    describe('compact()', function () {
        it('should return a new list compacted', function () {
            var list = new rode.List;
            list.add([1, 0, 2, false, 3, '']);
            expect(list.compact()).to.be.a(rode.List);
            expect(list.compact().equals([1, 2, 3])).to.be(true);
        });
    });

    describe('flatten()', function () {
        it('should return a new list flatten', function () {
            var list = new rode.List;
            list.add([[1, [2], [[3, [4, 5, [[6]]]]]]]);
            expect(list.flatten()).to.be.a(rode.List);
            expect(list.flatten().equals([1, 2, 3, 4, 5, 6])).to.be(true);
        });
    });

    describe('without()', function () {
        it('should return a list without the specified values', function () {
            var list = new rode.List;
            list.add([1, 2, 3, 4, 5, 6]);
            expect(list.without(1)).to.be.a(rode.List);
            expect(list.without(1, 3, 5).equals([2, 4, 6])).to.be(true);
            expect(list.without(1, 2, 3, 4, 5, 6).isEmpty()).to.be(true);
            expect(list.without(99).equals(list)).to.be(true);
        });
    });
});