function intervalConstruction(arr) {
    let validValues = ['Cb', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'E#' , 'Fb', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'B#'];
    const chromaticScale = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
    const intervals = {
        m2: [1, 2],
        M2: [2, 2],
        m3: [3, 3],
        M3: [4, 3],
        P4: [5, 4],
        P5: [7, 5],
        m6: [8, 6],
        M6: [9, 6],
        m7: [10, 7],
        M7: [11, 7],
        P8: [12, 8]
    };


    if (!(arr instanceof Array)) throw new Error('Input data must be an array of values');
    if (arr.length < 2 || arr.length > 3) throw new Error('Illegal number of elements in input array');
    if (!(validValues.includes(arr[1]))) throw new Error('Invalid input chromatic scale');
    if (!intervals[arr[0]]) throw new Error('Incorrect interval');

    function findFinish(startIndex, order , degree) {

        if (order === 'asc') {
            return notes[startIndex + degree > 7 ?
                degree + startIndex - 8
                : startIndex + degree - 1];
        } else if (order === 'dsc') {
            let condition = (startIndex - (degree - 1)) < 0;

            return notes[condition ? Math.abs(7 + startIndex - degree) + 1 : startIndex - degree + 1];
        }
    }

    let notes = chromaticScale.filter(item => item.length === 1);
    let start = arr[1],
        startIndex = notes.indexOf(arr[1][0]),
        order = arr[2] === 'dsc' ? 'dsc' : 'asc',
        finish = findFinish(startIndex, order, intervals[arr[0]][1]),
        planningLength = intervals[arr[0]][0],
        currentLength = 0,
        i = chromaticScale.indexOf(start[0]);

    while (chromaticScale[i] !== finish) {
        if (order === 'asc') {
            if (i >= 11) i = i - 12;

            currentLength += 1;
            i++;
        } else {
            if (i <= 0) i = i + 12;
            currentLength += 1;
            i--;
        }
    }

    if (start.length > 1) {
        if (order === 'asc') currentLength = start.includes('#') ? currentLength - 1 : currentLength + 1;
        if (order === 'dsc') currentLength = start.includes('b') ? currentLength - 1 : currentLength + 1;
    }

    if (order === 'asc') {
        return currentLength === planningLength ? finish
            : currentLength < planningLength ? finish + '#'.repeat(planningLength - currentLength)
                : finish + 'b'.repeat(currentLength - planningLength);
    } else {
        return currentLength === planningLength ? finish
            : currentLength > planningLength ? finish + '#'.repeat(currentLength - planningLength)
                : finish + 'b'.repeat(planningLength- currentLength);
    }

}

function intervalIdentification(arr) {
    let validValues = ['Cbb', 'Cb', 'C', 'C#', 'C##', 'Dbb', 'Db', 'D', 'D#', 'D##', 'Ebb', 'Eb', 'E', 'E#', 'E##', 'Fbb', 'Fb', 'F', 'F#', 'F##', 'Gbb', 'Gb', 'G', 'G#', 'G##', 'Abb', 'Ab', 'A', 'A#', 'A##', 'Bbb', 'Bb', 'B', 'B#', 'B##'];

    if (!(arr instanceof Array)) throw new Error('Input data must be an array of values');
    if (arr.length < 2 || arr.length > 3) throw new Error('Illegal number of elements in input array');
    if (!(validValues.includes(arr[0]))
        || !(validValues.includes(arr[1]))) throw new Error('Cannot identify the interval');


    function degreesCount(notes, start, end, order) {
        let degree = 1;
        let index = notes.indexOf(start);
        do {
            if (order === 'asc') {
                /*return notes[startIndex + degree > 7 ?
                    degree + startIndex - 8
                    : startIndex + degree - 1];*/

                index++;
                degree++

                if (index >= 7) {
                    index = index - 7;
                }
            } else {
                index--;
                degree++

                if (index <= 0) {
                    index = index + 7;
                }
            }
        } while (notes[index] !== end)

        return degree;
    }

    function semitonesCount(scale, start, end, order) {
        let semitones = 0;
        let index = scale.indexOf(start);
        do {
            if (order === 'asc') {
                if (index >= 12) {
                    index = index - 12;
                }

                index++;
                semitones++;
            } else {
                if (index <= 0) {
                    index = index + 12;
                }

                index--;
                semitones++;
            }
        } while (scale[index] !== end)

        return semitones;
    }

    const chromaticScale = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

    const intervals = {
        2: { 1: 'm2', 2: 'M2' },
        3: { 3: 'm3', 4: 'M3' },
        4: { 5: 'P4'},
        5: { 7: 'P5'},
        6: { 8: 'm6', 9: 'M6' },
        7: { 10: 'm7', '11': 'M7' },
        8: { 12: 'P8' }
    };

    let start = arr[0];
    let finish = arr[1];
    let order = arr[2] === 'dsc' ? 'dsc' : 'asc';

    let notes = chromaticScale.filter(item => item.length === 1);

    let degree = degreesCount(notes, start[0], finish[0], order);
    let semitones = semitonesCount(chromaticScale, start[0], finish[0], order);

    if (start.length > 1) {
        if (order === 'asc') semitones = start.includes('#') ? semitones - 1 : semitones + 1;
        if (order === 'dsc') semitones = start.includes('b') ? semitones - 1 : semitones + 1;
    }

    let end = finish.split('');

    if (end.length === 1) semitones = semitones;

    if (end.includes('b')) {
        if (order === 'asc') semitones = semitones - end.slice(1).length;
        if (order === 'dsc') semitones = semitones + end.slice(1).length;
    } else {
        if (order === 'asc') semitones = semitones + end.slice(1).length;
        if (order === 'dsc') semitones = semitones - end.slice(1).length;
    }

    return intervals[degree][semitones];
}
