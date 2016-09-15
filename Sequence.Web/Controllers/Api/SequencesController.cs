using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Application.Data;
using Application.Data.Entities;

namespace Application.Web.Controllers.Api
{
    public class SequencesController : ApiController
    {
        private SequenceContext db = new SequenceContext();

        // GET: api/Sequences
        public IQueryable<Sequence> GetSequences()
        {
            return db.Sequences;
        }

        // GET: api/Sequences/5
        [ResponseType(typeof(Sequence))]
        public async Task<IHttpActionResult> GetSequence(int id)
        {
            Sequence sequence = await db.Sequences.FindAsync(id);
            if (sequence == null)
            {
                return NotFound();
            }

            return Ok(sequence);
        }

        // PUT: api/Sequences/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutSequence(int id, Sequence sequence)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sequence.Id)
            {
                return BadRequest();
            }

            db.Entry(sequence).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SequenceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Sequences
        [ResponseType(typeof(Sequence))]
        public async Task<IHttpActionResult> PostSequence(Sequence sequence)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Sequences.Add(sequence);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = sequence.Id }, sequence);
        }

        // DELETE: api/Sequences/5
        [ResponseType(typeof(Sequence))]
        public async Task<IHttpActionResult> DeleteSequence(int id)
        {
            Sequence sequence = await db.Sequences.FindAsync(id);
            if (sequence == null)
            {
                return NotFound();
            }

            db.Sequences.Remove(sequence);
            await db.SaveChangesAsync();

            return Ok(sequence);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SequenceExists(int id)
        {
            return db.Sequences.Count(e => e.Id == id) > 0;
        }
    }
}