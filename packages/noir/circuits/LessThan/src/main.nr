fn main(x : Field, y : pub Field) {
    assert(x as u32 < y as u32);
}

#[test]
fn test_main() {
    main(1, 2);
}
