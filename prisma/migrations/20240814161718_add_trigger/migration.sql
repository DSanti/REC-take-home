-- Add reservations trigger


-- Create trigger function
CREATE FUNCTION enforce_no_overlapping()
RETURNS trigger AS $$
BEGIN
IF EXISTS (
	SELECT *
	FROM reservations r
	WHERE new.table_id = r.table_id
	AND (r.start_date BETWEEN new.start_date AND new.end_date 
	OR  r.end_date BETWEEN new.start_date AND new.end_date)
) THEN
	RAISE EXCEPTION 'Error: Reservations cannot overlap.';
ELSE
	RETURN new;
END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on reservations table

CREATE TRIGGER t_noOverlappingReservations 
   BEFORE INSERT ON  reservations
	FOR EACH ROW EXECUTE FUNCTION enforce_no_overlapping();